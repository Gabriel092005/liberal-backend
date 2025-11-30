import { makeDeleteUsers } from "@/use-cases/factories/make-delete-users";
import { makeAtivarConta } from "@/use-cases/factories/makeAtivarConta";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function AtivarConta(request: FastifyRequest, reply: FastifyReply) {
  try {
    const deleteUserParamsSchema = z.object({
      Id: z.coerce.number() // deve bater com :Id na rota
    });

    const { Id } = deleteUserParamsSchema.parse(request.body);
    console.log("Deleting user with Id:", Id);

    await makeAtivarConta().execute({
      userId: Number(Id)
    });

    return reply.status(204).send();
  } catch (error: any) {
    console.error(error);
    return reply.status(500).send({ error: "Erro ao deletar usuário", details: error });
  }
}

