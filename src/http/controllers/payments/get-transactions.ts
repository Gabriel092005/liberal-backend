import prisma from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

// Últimas 10 transações
export async function listarUltimasTransacoes(req: FastifyRequest, res: FastifyReply) {
  const transacoes = await prisma.transacao.findMany({
    take: 10,
    orderBy: { created_at: "desc" },
    include: {
      usuario: { select: { nome: true, celular:true } },
      pacote: { select: { title: true, preco: true } }
    }
  });

  return res.send(transacoes);
}

// Todas as transações com paginação
export async function listarTodasTransacoes(req: FastifyRequest, res: FastifyReply) {
  const schema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(20)
  });

  const { page, limit } = schema.parse(req.query);
  const skip = (page - 1) * limit;

  const [transacoes, total] = await prisma.$transaction([
    prisma.transacao.findMany({
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        usuario: { select: { nome: true, celular: true } },
        pacote: { select: { title: true, preco: true } }
      }
    }),
    prisma.transacao.count()
  ]);

  return res.send({
    data: transacoes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
}
