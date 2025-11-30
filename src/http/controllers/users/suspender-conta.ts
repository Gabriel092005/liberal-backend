import { makeDesativarConta } from "@/use-cases/factories/make-desativarConta";
import { makeSuspenderConta } from "@/use-cases/factories/make-suspender-conta";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function SuspenderConta(request: FastifyRequest, reply: FastifyReply) {
  try {
    const deleteUserParamsSchema = z.object({
      Id: z.coerce.string() // deve bater com :Id na rota
    });

    const { Id } = deleteUserParamsSchema.parse(request.body);
    console.log("Deleting user with Id:", Id);

    await makeSuspenderConta().execute({
      userId: Number(Id)
    });

    return reply.status(204).send();
  } catch (error: any) {
    console.error(error);
    return reply.status(500).send({ error: "Erro ao deletar usuário", details: error });
  }
}

