import prisma from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { RechargeRuleFactory } from "./rechargeFactory";
import { RechargeContext } from "./rechargeRuler";



export async function aprovarPagamento(req: FastifyRequest, res: FastifyReply) {
  const schema = z.object({ transacaoId: z.coerce.number() });
  const { transacaoId } = schema.parse(req.body);

  // ── 1. Buscar transação + pacote ────────────────────────────────────────────
  const transacao = await prisma.transacao.findUnique({
    where: { id: transacaoId },
    include: { pacote: true },
  });

  if (!transacao)          return res.status(404).send("Transação não encontrada");
  if (transacao.status !== "PENDENTE") return res.status(400).send("Já processada");
  if (!transacao.pacote)   return res.status(400).send("Pacote não encontrado");

  // ── 2. Buscar carteira ──────────────────────────────────────────────────────
  const carteira = await prisma.carteira.findUnique({
    where: { id: transacao.carteiraId },
  });

  if (!carteira) return res.status(404).send("Carteira não encontrada");

  const agora = new Date();
  const plano = transacao.pacote;

  // ── 3. Escolher regra via Factory ───────────────────────────────────────────
  const ctx: RechargeContext = {
    currentCoins : Number(carteira.receita),
    currentExpiry: carteira.expiraEm ? new Date(carteira.expiraEm) : null,
    planCoins    : Number(plano.preco),
    planDays     : Number(plano.validade),
    now          : agora,
  };

  const rule = RechargeRuleFactory.create(ctx);
  const { novasMoedas, novaValidade, regraaplicada } = rule.apply(ctx);

  console.log(`[aprovarPagamento] Regra: ${regraaplicada}`);
  console.log(`[aprovarPagamento] Moedas: ${ctx.currentCoins} → ${novasMoedas}`);
  console.log(`[aprovarPagamento] Validade: ${novaValidade.toISOString()}`);

  // ── 4. Transação atómica ────────────────────────────────────────────────────
  await prisma.$transaction([

    // Marca transação como aprovada
    prisma.transacao.update({
      where: { id: transacao.id },
      data : { status: "APROVADO" },
    }),

    // Actualiza carteira — SET (não increment)
    prisma.carteira.update({
      where: { id: carteira.id },
      data : {
        receita : novasMoedas,
        expiraEm: novaValidade,
      },
    }),

    // Regista no histórico com expires_at preenchido
    prisma.historicoRecargas.create({
      data: {
        valor      : transacao.valor,
        pacoteId   : Number(transacao.pacoteId),
        carteiraId : transacao.carteiraId,
        transacaoId: transacao.id,
        expires_at : novaValidade,  // ← essencial para o ExpirationService
        isExpired  : false,
      },
    }),

    // Notifica o prestador
    prisma.notificacao.create({
      data: {
        content: `Pagamento aprovado! Tens ${novasMoedas} moedas. Válido até ${novaValidade.toLocaleDateString("pt-PT")}.`,
        authrId: transacao.usuarioId,
      },
    }),
  ]);

  return res.send({
    message      : "Pagamento aprovado!",
    regraaplicada,
    moedas       : novasMoedas,
    validade     : novaValidade,
  });
}