import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { makeCreateFavoritoUseCase } from "@/use-cases/factories/make-favoritos"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"


export async function createFavoritoController(request: FastifyRequest, reply: FastifyReply) {
  const createFavoritoBodySchema = z.object({
    prestadorId: z.coerce.number(),
  })

  const { prestadorId } = createFavoritoBodySchema.parse(request.body)
  console.log(request.body)


  const clienteId = request.user.sub

  const createFavoritoUseCase = makeCreateFavoritoUseCase()

  try {
    const { favorito } = await createFavoritoUseCase.execute({
      clienteId:Number(clienteId),
      prestadorId:Number(prestadorId),
    })

    return reply.status(201).send(favorito)
  } catch (err:any) {
    if(err instanceof resourceNotFoundError){
         return reply.status(409).send(err.message)
    }
    throw err
    return reply.status(400).send(err)
  }
}
