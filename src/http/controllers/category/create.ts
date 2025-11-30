import { makeCreateNewCategory } from "@/use-cases/factories/make-createNewCategory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function createNewCategory(req:FastifyRequest, reply:FastifyReply){
    const createNewCategory = z.object({
      title:z.string(),
      Image_path: z.string().optional(), // adiciona aqui também
    })

    const userId = req.user.sub
    
    const image = (req as any).file
    const image_path = image?.filename ?? null;
    
    
    const rawBody = req.body as any;
    const bodyWithImage = {
      ...rawBody,
      image_path,
    };
    console.log(bodyWithImage)
  
    const {
      title,
      Image_path

    } = createNewCategory.parse(bodyWithImage);

    try {
         const {category} =await makeCreateNewCategory().execute({
            image_path:image_path,
            title,
            userId
         })
         return reply.status(201).send(category)
    } catch (error) {

        throw error
    }
}