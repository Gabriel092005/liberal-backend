import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { UpdateProfileImage } from "../upadte-imageProfile"



export function makeUpdateProfileImageUserCase (){
    
    const usersRepository = new PrismaUserRepository()
    const UseCase = new UpdateProfileImage(usersRepository)

    return UseCase
}