import { makeUpdateProfileUserCase } from "@/use-cases/factories/make-updateProfile";
import { makeUpdateUserLocationUserCase } from "@/use-cases/factories/make-updateUserLocation";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateUserLocation(request:FastifyRequest, reply:FastifyReply) {
    const UpdateProfileBodyShema=z.object({
           latitude:z.coerce.string(),
           longitude:z.coerce.string(),
           location:z.string().optional()
    })
    const {latitude,location,longitude} = UpdateProfileBodyShema.parse(request.body)
            const userId = request.user.sub
            console.log(request.body)
      

            try {
                  const UseCase = makeUpdateUserLocationUserCase()
                   await UseCase.execute({
                     latitude,
                     location,
                     longitude,
                     prestadorId:userId
                  })
                  return reply.status(204).send()
            } catch (error) {
                 throw error
            }
}