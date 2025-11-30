import { prisma } from "@/lib/prisma";
import { CarteiraRepoitory } from "@/repositories/carteira-repository";
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { historicoRepository } from "@/repositories/historico-repository";
import { NotificationRepository } from "@/repositories/notificacao-repository";
import { transacaoRepository } from "@/repositories/transaction-repository";
import { usersRepository } from "@/repositories/users-repository";
import { VitrineRepository } from "@/repositories/virine-repository";
import { io } from "@/server";
import { Postsvitrine } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface PromoverPerfilRequest {
  title: string;
  description: string;
  imagePath: string|null;
  authorId: number;
}

interface PromoverPerfilResponse {
  vitrine: Postsvitrine;
}

export class PromoverPerfilUseCase {
  constructor(
    private notificationRepository: NotificationRepository,
    private usersRepository: usersRepository,
    private carteiraRepository: CarteiraRepoitory,
    private recargasRepository: historicoRepository,
    private vitrineRepository: VitrineRepository,
    private transacaoRepository: transacaoRepository
  ) {}

  async execute({
    authorId,
    description,
    imagePath,
    title,
  }: PromoverPerfilRequest): Promise<PromoverPerfilResponse> {
    // 🔍 Verifica se o usuário existe
    const user = await this.usersRepository.findById(authorId);
    if (!user) throw new resourceNotFoundError();

    // 🚫 Apenas prestadores podem promover perfis
    if (
      user.role === "CLIENTE_COLECTIVO" ||
      user.role === "CLIENTE_INDIVIDUAL"
    ) {
      throw new Error("Apenas prestadores podem promover seus perfis.");
    }

    if (!authorId || isNaN(authorId)) {
      throw new Error("ID do usuário inválido ao criar post na vitrine.");
    }

    // 💰 Verifica saldo na carteira do prestador
    const carteiraPrestador = await this.carteiraRepository.findByUserId(authorId);
    if (!carteiraPrestador)
      throw new Error("Carteira não encontrada para este usuário.");

    const valorPromocao = 1000; // custo da promoção
    const saldoAtual = Number(carteiraPrestador.receita);

    if (saldoAtual < valorPromocao) {
      throw new Error("Saldo insuficiente para promover o perfil (necessário 1000 Kz).");
    }

    // 💸 Atualiza saldo do prestador (desconta valor)
    const novoSaldoPrestador = new Decimal(saldoAtual - valorPromocao);
    await this.carteiraRepository.updateSaldo(carteiraPrestador.id, novoSaldoPrestador);
    console.log(`💰 Saldo atualizado: ${saldoAtual} -> ${novoSaldoPrestador}`);

    // 🧾 Cria histórico de saída (prestador pagou)
    const transacao = await this.transacaoRepository.findById(user.id);
    if (transacao) {
      await this.recargasRepository.create({
        carteiraId: carteiraPrestador.id,
        valor: new Decimal(valorPromocao),
        catergoy: "OUTCOME",
        expires_at: null,
        pacoteId: Number(transacao.pacoteId),
        transacaoId: transacao.id,
        isExpired:false
      });
    }

    // 🏆 Cria o post na vitrine
    const vitrine = await this.vitrineRepository.create(
      String(authorId),
      description,
      title,
      String(user.image_path)
    );

    // 🔔 Cria notificações para todos os clientes
    const content = `O prestador ${user.nome} colocou uma nova informação na vitrine!`;
    const clientes = await this.usersRepository.findAllClientes();

    await Promise.all(
      clientes.map((cliente) =>
        this.notificationRepository.Notificar(content, cliente.id, user.image_path)
      )
    );

    // 💬 Atualiza notificações via socket em tempo real
    const notificacoes = await this.notificationRepository.findNotifications();
    io.emit("notificacoes_atualizadas", notificacoes);

    return { vitrine };
  }
}
