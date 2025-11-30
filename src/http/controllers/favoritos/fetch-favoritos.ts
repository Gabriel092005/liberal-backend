import { makeFetchFavoritosUseCase } from "@/use-cases/factories/make-favoritar";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function FetchFavoritosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
    const searchBodySchema = z.object({
        search:z.string().optional()
    })
    const {search} = searchBodySchema.parse(request.query)
    console.log(request.query)
  try {
    const clienteId = request.user.sub; // ou ID extraído do token JWT

    const fetchFavoritosUseCase = makeFetchFavoritosUseCase();
    const { favoritos } = await fetchFavoritosUseCase.execute({ clienteId:Number(clienteId) ,search});


    return reply.status(200).send({ favoritos });
  } catch (error) {
    throw error
  }
}
