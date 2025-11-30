import { makeUpdateProfileImageUserCase } from "@/use-cases/factories/make-UpdateProfileImage";
import { upload } from "@/utills/multer";
import { FastifyReply, FastifyRequest } from "fastify";

export async function updateProfileImage(req:FastifyRequest, reply:FastifyReply) {
    upload.single('image')(req.raw as any, reply.raw as any, (err: any) => {
      const rawReq = req.raw as any

      console.log(rawReq.file)
 
      const file = rawReq.file
        try {
    const userId = (req as any).user.sub // JWT
    const imageUrl = `${file.filename}`


    const useCase = makeUpdateProfileImageUserCase()
      useCase.execute({
        image:imageUrl,
        userId
      })
    return reply.status(200).send({
      message: 'Imagem de perfil atualizada com sucesso!',
    })
  } catch (error) {
    throw error
       return reply.status(500).send({ message: 'Erro ao atualizar imagem de perfil' })
  }
    
}
)}