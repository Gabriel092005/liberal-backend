import { CategoryRepository } from "@/repositories/category-repository"
import { category } from "@prisma/client"
export interface RegisterNewCatergoryRequest{
    query?:string
    }
    interface FetchCategoryResponse {
        category:category[]
    }

export class FetchCategoryUseCase {
     constructor (private CategoryRepository:CategoryRepository){}
     async execute({query}:RegisterNewCatergoryRequest):Promise<FetchCategoryResponse>{
         const category = await this.CategoryRepository.findManyCategories(query)
       return {
        category
       }    
     }
}