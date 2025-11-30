import { FastifyRequest,FastifyReply } from "fastify";
import { UserAreadyExistsError } from '@/repositories/errors/user-already-exists-error';
import { z } from "zod";
import { makeFetchPrestadoresUseCase } from "@/use-cases/factories/make-Fetchprestadores";


export async function FetchPrestadores(request:FastifyRequest,reply:FastifyReply) {  
    const SearchPrestadores = z.object({
          query:z.string().optional()
    })
   const {query} = SearchPrestadores.parse(request.query)
   try {
      const UseCase = makeFetchPrestadoresUseCase()
      const {Usuarios} = await UseCase.execute({
        query
      })
      return reply.status(201).send({prestadores:Usuarios})
   }
    catch (error) { 
      if( error instanceof UserAreadyExistsError){
         return reply.status(409).send({message :error.message,})
      }
      throw error
       
   }
   
}


