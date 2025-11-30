import { profissaoRepository } from "@/repositories/profissao-repository";
import { profissao } from "@prisma/client";

interface CreateNewProfissaoResponse{
     profissao:profissao[]
}
interface FetchProfissionByCategoryRequest{
     categoryId:number
}
export class FetchProfissionByCategory {
     constructor(private profissionRepository:profissaoRepository,

     ){}

     async execute({categoryId}:FetchProfissionByCategoryRequest):Promise<CreateNewProfissaoResponse>{

         const profissao = await this.profissionRepository.findProfissionByCategory(categoryId)

         return  {
            profissao
         }
     }
}