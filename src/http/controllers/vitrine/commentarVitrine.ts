import { makeCommentUseCase } from "@/use-cases/factories/make-reagirVitrine";
import  { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createComment(req: FastifyRequest, res: FastifyReply) {
    const createCommentBodySchema = z.object({
         content:z.string()
    })
    const createCommentParams = z.object({
        postId:z.coerce.number(),
   })
    const usuarioId = req.user.sub;

    const { content} = createCommentBodySchema.parse(req.body)
    const { postId } = createCommentParams.parse(req.params)
  
    if (!content) return res.status(400).send({ message: "Conteúdo vazio." });
  
    try {
      const useCase = makeCommentUseCase();
      const comment = await useCase.execute({
        usuarioId: Number(usuarioId),
        postId: Number(postId),
        content
      });
  
      return res.status(201).send(comment);
    } catch (err) {
      return res.status(400).send({ message: "Erro ao publicar comentário." });
    }
  }