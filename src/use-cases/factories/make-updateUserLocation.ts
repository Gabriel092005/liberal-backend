import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { UpdateProfileUseCase } from "../updateProfile"
import { UpdateUserLocationUseCase } from "../update-prestador-location"



export function makeUpdateUserLocationUserCase (){
    
    const usersRepository = new PrismaUserRepository()
    const UseCase = new UpdateUserLocationUseCase(usersRepository)

    return UseCase
}