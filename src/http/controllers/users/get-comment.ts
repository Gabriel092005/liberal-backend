

import { invalidCredentialsError } from "@/repositories/errors/invalid-credentials";
import { makeGetCommentUseCase } from "@/use-cases/factories/make-get-comment";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-getProfile";
import { FastifyRequest,FastifyReply } from "fastify";
import { z } from "zod";

export async function GetComment(request:FastifyRequest,reply:FastifyReply) {  
  try {
  
  
    const {Commentario} = await makeGetCommentUseCase().execute()   
        return reply.status(200).send(Commentario)
     } catch (error) {
         if(error instanceof invalidCredentialsError){
              return reply.status(409).send(error.message)
         }
      
     }

   }




   



