import { makeRemoveFavoritoUseCase } from "@/use-cases/factories/make-remove-favoritos"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function removeFavoritoController(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    prestadorId: z.coerce.number(),
  })

  const { prestadorId } = schema.parse(request.query)
  console.log(request.query)

  const clienteId = request.user.sub // ou ID vindo do token JWT

  const useCase = makeRemoveFavoritoUseCase()

  await useCase.execute({ clienteId: Number(clienteId), prestadorId })

  return reply.status(200).send({ message: "Prestador removido dos favoritos com sucesso." })
}
