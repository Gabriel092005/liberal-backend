import { makeFindManyAllVitrine } from "@/use-cases/factories/make-fetch-all-vitrine";
import { makeFindManyVitrine } from "@/use-cases/factories/makeFetchMyVitrinePosts";
import { FastifyRequest, FastifyReply } from "fastify";


export async function FindManyPostsVitrineaLLController(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {


    const findManyPostsVitrineUseCase = makeFindManyAllVitrine();

    const { vitrine } = await findManyPostsVitrineUseCase.execute();
    return res.status(200).send({ vitrine });
    
  } catch (error) {
    console.error("Erro ao buscar vitrine:", error);
    return res.status(500).send({
      message: "Erro ao listar postagens na vitrine.",
      error: (error as Error).message,
    });
  }
}
