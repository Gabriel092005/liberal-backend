import { makeColocarNaVitrine } from "@/use-cases/factories/make-colocarVitrine";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function PromoverPerfil(req: FastifyRequest, res: FastifyReply) {
  const PromoverPerfilBodySchema = z.object({
    title: z.string(),
    description: z.string(), // ✅ vírgula aqui, não ponto
  });

  const userId = req.user.sub;

  try {
    console.log(req.user);

    const { description, title } = PromoverPerfilBodySchema.parse(req.body);

    const { vitrine } = await makeColocarNaVitrine().execute({
      authorId: Number(userId),
      description,
      title,
      imagePath:''
    });

    return res.status(200).send({ vitrine });
  } catch (error) {
    if(error instanceof Error){
       return res.status(406).send('balance is not  enought')
    }
  }
}
