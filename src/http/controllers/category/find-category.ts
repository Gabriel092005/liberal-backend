import { makeCreateNewCategory } from "@/use-cases/factories/make-createNewCategory";
import { makeFetchCategory } from "@/use-cases/factories/make-fetch-category";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function FindCategory(req:FastifyRequest, reply:FastifyReply){
    const FindCategoryParams = z.object({
      query:z.string().optional(),
    })
    const {query} = FindCategoryParams.parse(req.params)
    try {
         const {category} =await makeFetchCategory().execute({
            query:query
         })
         return reply.status(201).send(category)
    } catch (error) {
        throw error
    }
}