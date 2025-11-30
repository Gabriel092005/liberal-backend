

import { invalidCredentialsError } from "@/repositories/errors/invalid-credentials";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-getProfile";
import { FastifyRequest,FastifyReply } from "fastify";

export async function Profile(request:FastifyRequest,reply:FastifyReply) {  
  try {
    const getUserProfile = makeGetUserProfileUseCase()

    const {user} = await getUserProfile.execute({
      userId:Number(request.user.sub)
    })
    
 
        
        return reply.status(200).send({usuario:user}
          
        )
     } catch (error) {
           if(error instanceof invalidCredentialsError){
                      return reply.status(409).send(error.message)
                 }
              
      
     }

   }




   



