import { PrismaPacotesRepository } from "@/repositories/prisma/prisma-pacotes-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { createNewPackageUseCase } from "../createPackage";


export function makeCreateNewPackage(){
     const usersRepository = new PrismaUserRepository()
     const packageRepository = new PrismaPacotesRepository()
     const useCase = new createNewPackageUseCase(packageRepository,usersRepository)
     return useCase
}