import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { UpdatecategoryUseCase } from "../update-category";

export function makeUpdateCategory(){
     const usersRepository = new PrismaUserRepository()
     const categoyRepository = new PrismaCategoryRepository()
     const UseCase = new UpdatecategoryUseCase(categoyRepository,usersRepository)
     return UseCase
}