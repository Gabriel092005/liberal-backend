import prisma from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

// Exemplo lógico da função no controller de pagamento
export async function CriarPedidoPagamento(req:FastifyRequest, res:FastifyReply) {

    const  criarPedidoPagamento = z.object({
        planoId:z.coerce.number(),
        valor:z.coerce.number(),
        walletId:z.coerce.number(),
        metodo:z.coerce.string()
    })
  const { planoId, valor, metodo,walletId } = criarPedidoPagamento.parse(req.body);
  const  usuarioId = req.user.sub

  const transacao = await prisma.transacao.create({
    data: {
      usuarioId:Number(usuarioId),
      pacoteId: planoId,
      valor,
      metodo,
      status: "PENDENTE",
      carteiraId: walletId
    }
  });


  const admins = await prisma.usuario.findMany({ where: { role: 'ADMIN' } });
  
  await prisma.notificacao.createMany({
    data: admins.map(admin => ({
      content: `${transacao.id}-Novo pagamento de ${valor} Kz aguardando aprovação.`,
      authrId: admin.id
    }))
  });

  return res.status(201).send({ message: "Aguardando aprovação do Admin" });
}