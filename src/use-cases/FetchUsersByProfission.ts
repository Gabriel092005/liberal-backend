import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { usersRepository } from "@/repositories/users-repository"
import { Usuario } from "@prisma/client"


interface FetchUsersByProfissionRequest{
      profissao:string
}

interface FetchUsersByProfissionResponse{
      Usuario:Usuario[]
}


export class FetchUsersByProfissionUseCase {
    constructor (private  usersRepository:usersRepository){}
    async execute({profissao}:FetchUsersByProfissionRequest):Promise<FetchUsersByProfissionResponse>{
         
        const Usuario = await this.usersRepository.FindByProfission(profissao)

        if(!Usuario){
              throw new resourceNotFoundError()
        }

        return  {
            Usuario
        }

    }

}