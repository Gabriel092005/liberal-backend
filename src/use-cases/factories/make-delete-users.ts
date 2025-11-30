import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { DeleteUsersUseCase } from "../delete-user";


export function makeDeleteUsers(){
     const usersRepository = new PrismaUserRepository()
     const useCase = new DeleteUsersUseCase(usersRepository)
     return useCase
}