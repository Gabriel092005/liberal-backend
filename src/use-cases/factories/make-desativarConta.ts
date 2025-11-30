import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { DesativarContaUseCase } from "../desativar-conta";

export function makeDesativarConta(){
    const usersRepository = new PrismaUserRepository()
    const useCase = new DesativarContaUseCase(usersRepository)
    return useCase
}