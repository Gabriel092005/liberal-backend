// src/http/controllers/usuario/update-bio-controller.ts
import { makeUpdateBioUseCase } from "@/use-cases/factories/make-update-bio-use-case"
import { FastifyRequest, FastifyReply } from "fastify"

export async function updateBioController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { description } = request.body as { description: string }
    const userId = Number(request.user?.sub) // se você usa JWT no Fastify

    if (!userId) {
      return reply.status(401).send({ message: "Usuário não autenticado" })
    }

    const updateBioUseCase = makeUpdateBioUseCase()
    await updateBioUseCase.execute({ userId, description })

    return reply.status(204).send() // sem conteúdo, sucesso
  } catch (error: any) {
    console.error(error)
    return reply.status(500).send({ message: error.message })
  }
}
