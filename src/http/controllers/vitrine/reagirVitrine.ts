import { makeToggleLikeUseCase } from "@/use-cases/factories/make-reagirVitrine";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function toggleLike(req: FastifyRequest, res: FastifyReply) {
 const toggleLikeParams=z.object({
    postId:z.coerce.number()
 })
 const { postId } = toggleLikeParams.parse(req.params)
  const usuarioId = req.user.sub; // Certifique-se que seu middleware de auth injeta o 'user'

  try {
    const useCase = makeToggleLikeUseCase();
    const result = await useCase.execute(Number(usuarioId), Number(postId));

    return res.status(200).send(result);
  } catch (err) {
    return res.status(400).send({ message: "Erro ao processar curtida." });
  }
}