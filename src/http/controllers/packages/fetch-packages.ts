import { makeFindAllPacotesUseCase } from "@/use-cases/factories/make-fetchPackages"
import { FastifyRequest, FastifyReply } from "fastify"


export async function findAllPacotesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const findAllPacotesUseCase = makeFindAllPacotesUseCase()
    const { packages } = await findAllPacotesUseCase.execute()

    return reply.status(200).send(packages)
  } catch (error) {
    console.error(error)
    return reply.status(500).send({
      message: "Erro ao listar pacotes",
      error: error instanceof Error ? error.message : error
    })
  }
}
