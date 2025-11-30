import { profissao } from "@prisma/client";


export interface profissaoRepository {
      create(title:string,carteiraId:number):Promise<profissao>
      findProfissionByCategory(categoryId:number):Promise<profissao[]>
      findProfissao():Promise<profissao[]>
}