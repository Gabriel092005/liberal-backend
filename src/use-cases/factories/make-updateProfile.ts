import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { UpdateProfileUseCase } from "../updateProfile"



export function makeUpdateProfileUserCase (){
    
    const usersRepository = new PrismaUserRepository()
    const UseCase = new UpdateProfileUseCase(usersRepository)

    return UseCase
}