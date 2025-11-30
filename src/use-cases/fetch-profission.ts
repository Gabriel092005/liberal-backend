import { profissaoRepository } from "@/repositories/profissao-repository";
import { profissao } from "@prisma/client";

interface CreateNewProfissaoResponse{
     profissao:profissao[]
}
export class FetchProfission {
     constructor(private profissionRepository:profissaoRepository,

     ){}

     async execute():Promise<CreateNewProfissaoResponse>{

         const profissao = await this.profissionRepository.findProfissao()

         return  {
            profissao
         }
     }
}