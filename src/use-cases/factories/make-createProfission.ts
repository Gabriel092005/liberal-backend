import { PrismaProfissaoRepository } from "@/repositories/prisma/prisma-profissao-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { CreateNewProfission } from "../createNewProfissao";

export function makeCreateProfission(){
     const usersRepository = new PrismaUserRepository()
     const profissionRepository = new PrismaProfissaoRepository()
     const useCase = new CreateNewProfission(profissionRepository,usersRepository)
     return useCase
}