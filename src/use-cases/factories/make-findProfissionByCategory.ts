import { PrismaProfissaoRepository } from "@/repositories/prisma/prisma-profissao-repository";
import { FetchProfissionByCategory } from "../fetch-profissionByCategory";

export function makeFetchProfissionByCategory(){
       const profissaoRepository = new PrismaProfissaoRepository()
       const useCase =  new FetchProfissionByCategory(profissaoRepository)
       return useCase
}