import { ListInteressesUseCase } from "@/use-cases/FetchInterestedOrders";
import { PrismaInteresseRepository } from "@/repositories/prisma/prisma-interesse-repository";
import { FastifyReply, FastifyRequest } from "fastify";


export async function InteresseOrdersController(req:FastifyRequest, reply:FastifyReply) {
    const prestadorId = req.user.sub

    const interesseRepo = new PrismaInteresseRepository();
    const listarUseCase = new ListInteressesUseCase(interesseRepo);

    try {
      const {interesses} = await listarUseCase.execute({ prestadorId:Number(prestadorId) });
      return  reply.send(interesses)
    } catch (error: any) {
      return reply.status(404).send({ message: error.message });
    }
}
