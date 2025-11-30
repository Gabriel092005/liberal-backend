import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { usersRepository } from "@/repositories/users-repository"
import { Usuario } from "@prisma/client"

interface UpdateUserProfileRequest{
    userId:number
    nome:string|undefined
    celular:string|undefined
    municipio:string|undefined,
    profissao:string|undefined
    provincia:string|undefined
}
interface UpdateUserProfileResponse{
     usuario:Usuario
}

export class UpdateProfileUseCase  {
     constructor ( private usersRepository:usersRepository){}

     async execute({celular,municipio,nome,provincia,profissao,userId}:UpdateUserProfileRequest):Promise<UpdateUserProfileResponse>{
            const user = await this.usersRepository.findById(userId)

            if(!user){
                 throw new resourceNotFoundError()
                }
                const usuario = await this.usersRepository.update(
                    celular,
                    nome,
                    municipio,
                    provincia,
                    userId,
            )
            return{
                usuario
            }


     }
}