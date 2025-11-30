import { FastifyRequest,FastifyReply } from "fastify";
import { io } from '@/server';
import { UserAreadyExistsError } from '@/repositories/errors/user-already-exists-error';
import { makeFetchPrestadoresDestaquesUseCase } from '@/use-cases/factories/make-FetchPrestadoresDestaques';


export async function FetchPrestadoresDestaques(request:FastifyRequest,reply:FastifyReply) {  
  
 

   try {
      const UseCase = makeFetchPrestadoresDestaquesUseCase()
      const {usuarios} = await UseCase.execute()
   //   io.emit("users", user)

      return reply.status(201).send({usuarios})
   }
    catch (error) { 
      if( error instanceof UserAreadyExistsError){
         return reply.status(409).send({message :error.message,})
      }
      throw error
       
   }
   
}


