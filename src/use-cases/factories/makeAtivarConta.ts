import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { AtivarContaUseCase } from "../ativar-conta";

export function makeAtivarConta(){
    const usersRepository = new PrismaUserRepository()
    const useCase = new AtivarContaUseCase(usersRepository)
    return useCase
}