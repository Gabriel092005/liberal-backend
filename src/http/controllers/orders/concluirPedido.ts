// src/http/controllers/concluir-pedido-controller.ts
import { makeConcluirPedidoUseCase } from "@/use-cases/factories/make-concluirInteresse";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function concluirPedidoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const concluirBodySchema = z.object({
    pedidoId: z.number(),
  });

  const { pedidoId } = concluirBodySchema.parse(request.body);

  try {
    const concluirPedidoUseCase = makeConcluirPedidoUseCase();

    // Assumindo que o ID do prestador vem do token JWT (request.user.sub)
    const prestadorId = Number(request.user.sub);

    await concluirPedidoUseCase.execute({
      prestadorId,
      pedidoId,
    });

    return reply.status(200).send({ message: "Pedido concluído com sucesso!" });
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}