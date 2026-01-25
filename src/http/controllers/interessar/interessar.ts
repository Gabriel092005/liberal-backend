import { makeInteressar } from "@/use-cases/factories/make-interessar";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export  async function Interessar (req:FastifyRequest, reply:FastifyReply){
   const InteressarRequestBody  = z.object({
     pedidoId:z.coerce.number(),
   }
)
 try {

      const {pedidoId} = InteressarRequestBody.parse(req.body)
      const authorIdId = req.user.sub

      console.log(req.body)

      

      const {interesse} = await makeInteressar().execute({
        authorId:Number(authorIdId),
        pedidoId:Number(pedidoId)
      })

      return reply.status(201).send(interesse)

 } catch (error) {
     throw error
 }
}