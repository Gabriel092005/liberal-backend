import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { CreateAnewCategoryUseCase } from "../createNewCategory";

export function makeCreateNewCategory(){
     
     const usersRepository = new PrismaUserRepository()
     const categoyRepository = new PrismaCategoryRepository()
     const UseCase = new CreateAnewCategoryUseCase(categoyRepository,usersRepository)
     return UseCase
}