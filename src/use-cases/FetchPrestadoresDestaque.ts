import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { usersRepository } from "@/repositories/users-repository"
import { Usuario } from "@prisma/client"
interface UsuarioDestaque {
  nome: string;
  estrelas: number | null;
  profissao: string;
  provincia: string;
  role: string;
  image_path?: string | null;
  municipio: string;
  celular: string;
}

interface FetchPrestadoresDestaquesResponse{
      usuarios:UsuarioDestaque[]
}

export class FetchUPrestadoresDestaquesUseCase {
    constructor (private  usersRepository:usersRepository){}
    async execute():Promise<FetchPrestadoresDestaquesResponse>{
        const usuarios = await this.usersRepository.FindPrestadoresDestaques()
        if(!usuarios){
              throw new resourceNotFoundError()
        }
       
        return  {
            usuarios
        }
    }
}