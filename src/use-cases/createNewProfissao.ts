import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { profissaoRepository } from "@/repositories/profissao-repository";
import { usersRepository } from "@/repositories/users-repository";
import { profissao } from "@prisma/client";

interface CreateNewProfissao {
    userId:number,
    categoryId:number
    title:string
}
interface CreateNewProfissaoResponse{
     profissao:profissao
}
export class CreateNewProfission {
     constructor(private profissionRepository:profissaoRepository,
                 private usersRepository:usersRepository

     ){}

     async execute({title,userId,categoryId}:CreateNewProfissao):Promise<CreateNewProfissaoResponse>{
         const usuario = await this.usersRepository.findById(userId)

         if(!usuario){
             throw new resourceNotFoundError()
         }
         if(usuario.role!=='ADMIN'){
              throw new Error('you do not have permission to create a new profission')
         }

         const profissao = await this.profissionRepository.create(title,categoryId)

         return  {
            profissao
         }
     }
}