

import { invalidCredentialsError } from "@/repositories/errors/invalid-credentials";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-getProfile";
import { FastifyRequest,FastifyReply } from "fastify";
import { z } from "zod";

export async function ProfileById(request:FastifyRequest,reply:FastifyReply) {  
  try {
    const  getUserProfileRequestParams = z.object({
        userId:z.coerce.number()
    })
    console.log(request.params)
    const { userId } =  getUserProfileRequestParams.parse(request.params)

    const {user} = await makeGetUserProfileUseCase().execute(
        {
      userId:userId
    }
    )   
        return reply.status(200).send({usuario:user}
          
        )
     } catch (error) {
         if(error instanceof invalidCredentialsError){
              return reply.status(409).send(error.message)
         }
      
     }

   }




   



