import { makeMarkNotificationsAsSeenUseCase } from "@/use-cases/factories/makeMark";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";


export async function markNotificationsAsSeenController(
  request: FastifyRequest,
  reply: FastifyReply
) {
   

  const userId  =  request.user.sub;

  console.log(request.user)

  const markAsSeenUseCase = makeMarkNotificationsAsSeenUseCase();

  await markAsSeenUseCase.execute({ userId });

  return reply.status(200).send({ message: "Notificações marcadas como vistas." });
}
