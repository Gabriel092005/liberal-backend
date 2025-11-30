
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFecharPedidoCase } from "@/use-cases/factories/make-fechar-Pedido";
import z from "zod";
import { makeInterromperPedidoCase } from "@/use-cases/factories/make-interromperOrders";


export async function ImterromperPedido(req: FastifyRequest, reply: FastifyReply) {
  const ImterromperPedidoOrderBodySchema = z.object({
    pedidoId: z.coerce.number(),
    prestadorId:z.coerce.number()
  });

  const clientId = req.user.sub;

  const { pedidoId , prestadorId} = ImterromperPedidoOrderBodySchema.parse(req.body);
  await makeInterromperPedidoCase().execute({
   clientId,
   prestadorId,
    pedidoId
  });

  return reply.status(204).send();
}
