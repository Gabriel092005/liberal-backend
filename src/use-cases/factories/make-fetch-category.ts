import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { FetchCategoryUseCase } from "../fetch-category";


export function makeFetchCategory(){
     const CategoryRepository = new PrismaCategoryRepository()
     const useCase = new FetchCategoryUseCase(CategoryRepository)
     return useCase
}