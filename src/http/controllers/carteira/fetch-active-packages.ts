import { makeListarHistoricoPacotesUseCase } from "@/use-cases/factories/make-get-activepackages";
import { FastifyReply, FastifyRequest } from "fastify";


export async function listarHistoricoPacotesController(req: FastifyRequest, reply: FastifyReply) {
  try {
    const usuarioId = req.user.sub // extraído do token JWT

    const listarHistoricoPacotesUseCase = makeListarHistoricoPacotesUseCase();
    const historico = await listarHistoricoPacotesUseCase.execute({ usuarioId });

    return reply.status(200).send({
      success: true,
      historico,
    });
  } catch (error) {
    return reply.status(400).send({
      success: false,
      message: (error as Error).message,
    });
  }
}
