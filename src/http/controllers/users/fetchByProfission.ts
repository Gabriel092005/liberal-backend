
import {z} from'zod'
import { FastifyRequest,FastifyReply } from "fastify";
import { io } from '@/server';
import { UserAreadyExistsError } from '@/repositories/errors/user-already-exists-error';
import { makeGetFetchUsersByProfissionUseCase } from '@/use-cases/factories/make-FetchByProfission';


export async function FetchByProfission(request:FastifyRequest,reply:FastifyReply) {  
    const FindByProfissionBodySchema = z.object({
       query : z.string()
     })
    const {query} = FindByProfissionBodySchema.parse(request.query)

   try {
      const UseCase = makeGetFetchUsersByProfissionUseCase()
      const {Usuario} = await UseCase.execute({
        profissao:query,
     })
   //   io.emit("users", user)

      return reply.status(201).send({Usuario})
   }
    catch (error) { 
      if( error instanceof UserAreadyExistsError){
         return reply.status(409).send({message :error.message,})
      }
      throw error
       
   }
   
}


