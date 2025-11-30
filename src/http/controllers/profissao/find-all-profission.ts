import { makeCreateProfission } from "@/use-cases/factories/make-createProfission";
import { makeFetchProfission } from "@/use-cases/factories/make-fetchProfission";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function findProfission(req:FastifyRequest, reply:FastifyReply){
  
    try {
     const {profissao} = await makeFetchProfission().execute()
     return {profissao}
        
    } catch (error) {
          throw error
    }
}