import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { SuspenderContaUseCase } from "../Suspender-conta";

export function makeSuspenderConta(){
    const usersRepository = new PrismaUserRepository()
    const useCase = new SuspenderContaUseCase(usersRepository)
    return useCase
}