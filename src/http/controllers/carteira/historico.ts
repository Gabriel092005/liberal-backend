import { PrismaHistoricoRecargasRepository } from "@/repositories/prisma/prisma-historicoRecargas";
import { GetHistoricoRecargasUseCase } from "@/use-cases/get-historico-recargas";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function getHistoricoRecargasController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
   const getHistoricoRecargasQuery = z.object({
    carteiraId:z.coerce.number()
   })
   console.log(request.query)
   const {carteiraId} = getHistoricoRecargasQuery.parse(request.query)

    const historicoRepository = new PrismaHistoricoRecargasRepository();
    const getHistoricoRecargas = new GetHistoricoRecargasUseCase(
      historicoRepository
    );

    const historico = await getHistoricoRecargas.execute({ carteiraId });

    return reply.status(200).send(historico);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Erro ao buscar histórico de recargas" });
  }
}
