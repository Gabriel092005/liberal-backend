import { makeGetCreditCardData } from "@/use-cases/factories/make-GetCreditCardData";
import { FastifyReply, FastifyRequest } from "fastify";

export async function GetCarteiraData(req:FastifyRequest, reply:FastifyReply){
    try {
         const userId = req.user.sub

         const {carteira} =await makeGetCreditCardData().execute({
            userId:Number(userId)
         })
     
      
         return reply.status(200).send(carteira)
    } catch (error) {
        throw error
    }
    
}