import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { NotificationRepository } from "@/repositories/notificacao-repository";
import { OrderRepository } from "@/repositories/pedidos-repository";
import { usersRepository } from "@/repositories/users-repository";
import { io } from "@/server";
import prisma from "@/lib/prisma";

interface FecharPedidoRequest {
  clientId   : number;
  prestadorId: number;
  pedidoId   : number;
}

const CUSTO_POR_NEGOCIACAO = 1000;

export class FetcharPedidoUseCase {
  constructor(
    private ordersRepository      : OrderRepository,
    private NotificationRepository: NotificationRepository,
    private usersRepository       : usersRepository
  ) {}

  async execute({ pedidoId, clientId, prestadorId }: FecharPedidoRequest): Promise<null> {

    const client = await this.usersRepository.findById(clientId);

    if (!client) throw new resourceNotFoundError();

    if (
      client.role === "PRESTADOR_COLECTIVO" ||
      client.role === "PRESTADOR_INDIVIDUAL"
    ) {
      throw new Error("Only Costumer can accept orders");
    }
    const pedido = await this.ordersRepository.findById(pedidoId);

    if (!pedido) {
      throw new Error("Impossivel fechar um pedido que nao existe!");
    }

    // ✅ Pedido só pode ser fechado UMA VEZ
    if (pedido.status === "ACEPTED") {
      throw new Error("Este pedido já foi confirmado anteriormente.");
    }

    if (pedido.status === "INTERRUPTED") {
      throw new Error("Este pedido foi interrompido e não pode ser confirmado.");
    }


    const carteira = await prisma.carteira.findUnique({
      where: { usuarioId: prestadorId },
    });

    if (!carteira) {
      throw new Error("O prestador não tem carteira activa. Adquire um plano para continuar.");
    }

    const agora = new Date();
    const planoExpirado = !carteira.expiraEm || carteira.expiraEm < agora;

    if (planoExpirado) {
      throw new Error("O teu plano expirou. Renova para continuar a receber contactos.");
    }

    // ── 3b. Moedas suficientes? ─────────────────────────────────────────────
    const moedas = Number(carteira.receita);

    if (moedas < CUSTO_POR_NEGOCIACAO) {
      throw new Error(
        `Saldo insuficiente. Precisas de ${CUSTO_POR_NEGOCIACAO} moedas. Tens ${moedas} moedas.`
      );
    }

    // ── 4. Fecha + desconta + notifica (tudo atómico) ───────────────────────
    const prestador = await this.usersRepository.findById(prestadorId);

    const content = `${prestador?.nome}, O cliente ${client.nome} confirmou negociação. Contacto desbloqueado: ${client.celular} (-${CUSTO_POR_NEGOCIACAO} moedas)`;

    await prisma.$transaction([

      prisma.pedido.update({
        where: { id: pedidoId },
        data : { status: "ACEPTED" },
      }),

      // ✅ REGRA 1 — desconta só após confirmação do cliente
      prisma.carteira.update({
        where: { usuarioId: prestadorId },
        data : { receita: { decrement: CUSTO_POR_NEGOCIACAO } },
      }),

      // Regista despesa no histórico
      prisma.historicoRecargas.create({
        data: {
          valor     : CUSTO_POR_NEGOCIACAO,
          catergoy  : "OUTCOME",
          pacoteId  : 1,
          carteiraId: carteira.id,
        },
      }),

      // ✅ Notifica com o número do cliente incluído
      prisma.notificacao.create({
        data: {
          content,
          authrId: prestadorId,
          image  : client.image_path ?? null,
        },
      }),

    ]);

    const notificacoes = await this.NotificationRepository.findMyNotifications(pedido.usuarioId);
    io.emit("user", notificacoes);

    return null;
  }
}