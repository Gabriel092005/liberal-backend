import { CarteiraRepoitory } from "@/repositories/carteira-repository";
import { historicoRepository } from "@/repositories/historico-repository";
import { pacotesRepository } from "@/repositories/pacotes-repository";
import { transacaoRepository } from "@/repositories/transaction-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface RecarregarCarteiraRequest {
  usuarioId: number;
  pacoteId: number;
  metodo: string;
}

export class RecarregarCarteiraUseCase {
  constructor(
    private carteiraRepository: CarteiraRepoitory,
    private transacaoRepository: transacaoRepository,
    private pacotesRepository: pacotesRepository,
    private historicoRepository: historicoRepository
  ) {}

  async execute({ metodo, pacoteId, usuarioId }: RecarregarCarteiraRequest) {
    // 1️⃣ Buscar carteira do usuário
    const carteira = await this.carteiraRepository.FindDigitalCardDates(usuarioId);
    if (!carteira) throw new Error("Você não possui carteira digital.");

    // 2️⃣ Buscar pacote
    const pacote = await this.pacotesRepository.findPacote(pacoteId);
    if (!pacote) throw new Error("Pacote não encontrado.");

    // 3️⃣ Calcular novo saldo
    const novoSaldo = new Decimal(carteira.receita).plus(pacote.preco);

    // 4️⃣ Criar transação
    const transacao = await this.transacaoRepository.create({
      usuarioId,
      carteiraId: carteira.id,
      pacoteId: pacote.id,
      valor: pacote.preco,
      metodo,
      status: "COMPLETED",
    });

    // 5️⃣ Calcular data de expiração do pacote
    const validadeEmDias = Number(pacote.validade); // garante que seja number
    const dataExpiracao = new Date(Date.now() + validadeEmDias * 24 * 60 * 60 * 1000);

    // 6️⃣ Criar histórico da recarga com expires_at
    await this.historicoRepository.create({
      carteiraId: carteira.id,
      pacoteId: pacote.id,
      valor: pacote.preco,
      catergoy: "INCOME",           // corrigido typo
      expires_at: dataExpiracao,    // campo correto
      transacaoId: transacao.id,
      isExpired: false,             // opcional, inicializa como não expirado
});


    // 7️⃣ Atualizar saldo da carteira
    await this.carteiraRepository.updateSaldo(carteira.id, novoSaldo);

    // 8️⃣ Retornar resultado
    return {
      message: "Recarga efetuada com sucesso",
      carteira: {
        saldoAnterior: carteira.receita,
        novoSaldo,
      },
      transacao,
      pacote,
      expires_at: dataExpiracao, // retorna também a data de expiração
    };
  }
}
