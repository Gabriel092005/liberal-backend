import { usersRepository } from "@/repositories/users-repository"
import { Usuario } from "@prisma/client"

interface FetchPrestadoresResponse{
     query:string | undefined
}

interface FetchPrestadoresDestaquesResponse{
      Usuarios:Usuario[]
}

export class FetchUPrestadoresUseCase {
    constructor (private  usersRepository:usersRepository){}
    async execute({query}:FetchPrestadoresResponse):Promise<FetchPrestadoresDestaquesResponse>{

         
        const Usuarios = await this.usersRepository.FindPrestadores(query)
     
        return  {
            Usuarios
        }

    }

}