import { makeCreateProfission } from "@/use-cases/factories/make-createProfission";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createNewProfission(req:FastifyRequest, reply:FastifyReply){
     const createNewProfissionBodySchema=z.object({
         title:z.string(),
         categoryId:z.coerce.number()
     })

     const {title,categoryId} = createNewProfissionBodySchema.parse(req.body)
     const userId = req.user.sub
    try {
     const { profissao } = await makeCreateProfission().execute({
        title,
        userId,
        categoryId
     })
     return {profissao}
        
    } catch (error) {
          throw error
    }
}