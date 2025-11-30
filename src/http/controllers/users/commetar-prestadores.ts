import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { makeCommentarPrestadoresCase } from "@/use-cases/factories/make-commentarPrestadores";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function Commentar(request: FastifyRequest, reply: FastifyReply) {
  try {
    const commentarPrestadorRequestBody = z.object({
     content:z.string(),
     userId:z.coerce.number() // deve bater com :Id na rota
    });

    console.log(request.body)
    
    const { content,userId } = commentarPrestadorRequestBody.parse(request.body);

    await makeCommentarPrestadoresCase().execute({
       content:content,prestadorId:userId
    });

    return reply.status(204).send();
  } catch (error) {
    console.error(error);

    if(error instanceof resourceNotFoundError){
          return reply.status(409).send(error.message)
    }
    
    return reply.status(500).send({ error: "Erro ao deletar usuário", details: error });
  }
}

