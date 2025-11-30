import { makeDeleteVitrine } from "@/use-cases/factories/make-delete-vitrine";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function deleteVitrine(req:FastifyRequest, reply:FastifyReply){
  try {
        const deleteVitrineQueryParams = z.object({
        vitrineId:z.coerce.string()
    })    
    
    
    const  {vitrineId}  = deleteVitrineQueryParams.parse(req.body)
    console.log("vitrineId : ",vitrineId)
   await makeDeleteVitrine().execute({
    VitrineId:Number(vitrineId)
  })

  return reply.status(204).send()
  } catch (error) {
      throw error
  }
}