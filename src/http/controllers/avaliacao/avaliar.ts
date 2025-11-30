import { makeAvaliarPrestadores } from "@/use-cases/factories/make-giveStarts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function Avaliar(req:FastifyRequest,reply:FastifyReply){
      const AvaliarPrestadoresSchema = z.object({
         prestadorId:z.number(),
      })
      const {prestadorId} = AvaliarPrestadoresSchema.parse(req.body)
      console.log(req.body)
      const clienteId =  req.user.sub

      try {
            await makeAvaliarPrestadores().execute({
                clienteId:Number(clienteId),
                nota:1,
                prestadorId
            })
            reply.status(204).send()
      } catch (error) {
          throw error
      }
    
}