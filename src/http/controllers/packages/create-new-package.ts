

import { FastifyRequest,FastifyReply } from "fastify";
import { UserAreadyExistsError } from '@/repositories/errors/user-already-exists-error';
import { z } from "zod";
import { makeCreateNewPackage } from "@/use-cases/factories/make-create-newPackage";


export async function CreateNewPackage(request:FastifyRequest,reply:FastifyReply) {  
    const CreateNewPackageBodySchema = z.object({
         preco:z.coerce.number(),
         title:z.string(),
         validade:z.string(),
         beneficio1:z.string().optional(),
         beneficio2:z.string().optional(),
         beneficio3:z.string().optional(),
    })
    console.log(request.body)
   const {preco,title,validade,beneficio1,beneficio2,beneficio3} = CreateNewPackageBodySchema.parse(request.body)
   try {
      const UseCase = makeCreateNewPackage()
      const userId= request.user.sub
      const {pacote} = await UseCase.execute({
        data:{
            beneficio1,
            beneficio2,
            beneficio3,
            preco:Number(preco),
            title,
            userId,
            validade
        }
      })
      return reply.status(201).send({pacote})
   }
    catch (error) { 
      if( error instanceof UserAreadyExistsError){
         return reply.status(409).send({message :error.message,})
      }
      throw error
       
   }
   
}


