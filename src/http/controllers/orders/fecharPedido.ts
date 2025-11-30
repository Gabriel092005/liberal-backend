
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFecharPedidoCase } from "@/use-cases/factories/make-fechar-Pedido";
import z from "zod";


export async function FecharPedido(req: FastifyRequest, reply: FastifyReply) {
  const CreateNewOrderBodySchema = z.object({
    pedidoId: z.coerce.number(),
    prestadorId:z.coerce.number()
  });

  console.log(req.body)

  const clientId = req.user.sub;

  const { pedidoId , prestadorId} = CreateNewOrderBodySchema.parse(req.body);
  await makeFecharPedidoCase().execute({
   clientId,
   prestadorId,
    pedidoId
  });

  return reply.status(204).send();
}
