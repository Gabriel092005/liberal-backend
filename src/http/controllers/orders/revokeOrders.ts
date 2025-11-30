
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRevokeOrders } from "@/use-cases/factories/make-RevokeOrders";

export async function RevokeOrder(req: FastifyRequest, reply: FastifyReply) {
  const RevokeOrderBodySchema = z.object({
    pedidoId: z.coerce.number(),
  });

  const { pedidoId } = RevokeOrderBodySchema.parse(req.query);
  console.log(req.query)
  const {orders} = await makeRevokeOrders().execute({
    pedidoId:Number(pedidoId)
  })

  return reply.status(201).send(orders);
}
