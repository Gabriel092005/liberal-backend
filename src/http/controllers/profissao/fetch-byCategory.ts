import { PrismaProfissaoRepository } from "@/repositories/prisma/prisma-profissao-repository";
import { makeFetchProfissionByCategory } from "@/use-cases/factories/make-findProfissionByCategory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function FetchProfissionByCategory(req:FastifyRequest, reply:FastifyReply){
       const searhProfissionByCategory = z.object({
           categoryId : z.coerce.number()
       })
       console.log("c:",req.params)
       const { categoryId } = searhProfissionByCategory.parse(req.params)

       const {profissao} =await makeFetchProfissionByCategory().execute({
               categoryId
       })
       
       return reply.status(200).send(profissao)
}