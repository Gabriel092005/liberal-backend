import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { UpdatePhotoCategoryUseCase } from "../update-categoryPhoto";

export function makeUpdatePhotoCategory(){
     const usersRepository = new PrismaUserRepository()
     const categoyRepository = new PrismaCategoryRepository()
     const UseCase = new UpdatePhotoCategoryUseCase(categoyRepository,usersRepository)
     return UseCase
}