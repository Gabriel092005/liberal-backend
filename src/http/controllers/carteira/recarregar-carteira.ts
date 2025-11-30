import { makeRecarregarCarteira } from "@/use-cases/factories/make-recarregarCarteira";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";



export async function RecarregarCarteira(req:FastifyRequest,reply:FastifyReply){
    const RecarregarCarteiraRequestBody = z.object({
         pacoteId:z.number(),
         metodo:z.string(),
    })
    console.log(req.body)

    const {metodo,pacoteId} = RecarregarCarteiraRequestBody.parse(req.body)
    const  usuarioId = req.user.sub
    try {
         const recarga = await makeRecarregarCarteira().execute({
            metodo,
            pacoteId,
            usuarioId:Number(usuarioId)
         })

         return reply.status(200).send(recarga);
         
    } catch (error) {
         throw error
              return reply.status(400).send({ message: error});

        
    }
}