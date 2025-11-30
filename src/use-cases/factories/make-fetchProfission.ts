import { PrismaProfissaoRepository } from "@/repositories/prisma/prisma-profissao-repository";
import { FetchProfission } from "../fetch-profission";

export function makeFetchProfission(){
       const profissaoRepository = new PrismaProfissaoRepository()
       const useCase =  new FetchProfission(profissaoRepository)
       return useCase
}