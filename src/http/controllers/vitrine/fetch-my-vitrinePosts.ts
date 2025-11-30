import { makeFindManyVitrine } from "@/use-cases/factories/makeFetchMyVitrinePosts";
import { FastifyRequest, FastifyReply } from "fastify";


export async function FindManyPostsVitrineController(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const userId = Number(req.user.sub); // vem do token JWT

    const findManyPostsVitrineUseCase = makeFindManyVitrine();

    const { vitrine } = await findManyPostsVitrineUseCase.execute({
      userId,
    });

    return res.status(200).send({ vitrine });
  } catch (error) {
    console.error("Erro ao buscar vitrine:", error);
    return res.status(500).send({
      message: "Erro ao listar postagens na vitrine.",
      error: (error as Error).message,
    });
  }
}
