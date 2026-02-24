import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function aprovarPagamento(req: FastifyRequest, res: FastifyReply) {
  
  const schema = z.object({ transacaoId: z.coerce.number() });
  const { transacaoId } = schema.parse(req.body);

  // 1. Buscar transação com o pacote incluído
  const transacao = await prisma.transacao.findUnique({
    where: { id: transacaoId },
    include: { pacote: true }
  });

  if (!transacao) return res.status(404).send("Transação não encontrada");
  if (transacao.status !== "PENDENTE") return res.status(400).send("Já processada");

  // 2. Buscar carteira atual
  const carteira = await prisma.carteira.findUnique({
    where: { id: transacao.carteiraId }
  });

  if (!carteira) return res.status(404).send("Carteira não encontrada");

  const agora = new Date();
  const plano = transacao.pacote;
  const validadeAtual = carteira.expiraEm ? new Date(carteira.expiraEm) : null;
  const planoExpirado = !validadeAtual || validadeAtual < agora;

  let novasMoedas: number;
  let novaValidade: Date;

  if (planoExpirado) {
    // 🔹 REGRA 2 – Expirou: recebe só as moedas do novo plano e novo prazo
 novasMoedas =  Number(plano?.preco ?? 0);
novaValidade = new Date(agora);
novaValidade.setDate(novaValidade.getDate() + Number(plano?.validade ?? 0));
  } else {
    // 🔹 REGRA 3 & 4 – Ainda válido: soma moedas e soma prazos
    const msRestantes = validadeAtual!.getTime() - agora.getTime();
    const diasRestantes = Math.ceil(msRestantes / (1000 * 60 * 60 * 24));

novasMoedas = Number(carteira.receita) + Number(plano?.preco);
  novaValidade = new Date(agora);
novaValidade.setDate(novaValidade.getDate() + diasRestantes + Number(plano?.validade));
  }

  // 3. Transação atômica
  await prisma.$transaction([
    // Atualiza status da transação
    prisma.transacao.update({
      where: { id: transacao.id },
      data: { status: "APROVADO" }
    }),

    // Atualiza carteira com moedas + validade + receita
    prisma.carteira.update({
      where: { id: carteira.id },
      data: {
        expiraEm: novaValidade,
        receita: { increment: transacao.valor }
      }
    }),

    // Histórico de recarga
    prisma.historicoRecargas.create({
      data: {
        valor: transacao.valor,
        pacoteId: Number(transacao.pacoteId),
        carteiraId: transacao.carteiraId,
        transacaoId: transacao.id
      }
    }),

    // Notifica o prestador
    prisma.notificacao.create({
      data: {
        content: `Pagamento aprovado! Recebeu ${plano?.preco} moedas. Validade até ${novaValidade.toLocaleDateString("pt-PT")}.`,
        authrId: transacao.usuarioId
      }
    })
  ]);

  return res.send({ message: "Pagamento aprovado!", moedas: novasMoedas, validade: novaValidade });
}