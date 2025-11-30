import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { RegisterNewCategory } from "../register-new-category";


export function makeRegisterCategory (){
     const categoyRepository = new PrismaCategoryRepository()
     const UseCase = new RegisterNewCategory(categoyRepository)
     return UseCase
}