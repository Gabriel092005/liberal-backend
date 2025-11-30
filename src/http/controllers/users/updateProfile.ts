import { makeUpdateProfileUserCase } from "@/use-cases/factories/make-updateProfile";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UpdateProfile(request:FastifyRequest, reply:FastifyReply) {
    const UpdateProfileBodyShema=z.object({
          nome:z.string().optional(),
          celular:z.string().optional(),
           province:z.string().optional(),
           municipio:z.string().optional(),
           profissao:z.string().optional()
    })
    const {celular,municipio,nome,profissao,province} = UpdateProfileBodyShema.parse(request.body)
            const userId = request.user.sub
            console.log(request.body)
      

            try {
                  const UseCase = makeUpdateProfileUserCase()
                  const {usuario} = await UseCase.execute({
                    celular:celular,
                    municipio,
                    nome,
                    profissao,
                    provincia:province,
                    userId:Number(userId)
                  })
                  return reply.status(201).send(usuario)
            } catch (error) {
                 throw error
            }
}