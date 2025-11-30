import { CategoryRepository } from "@/repositories/category-repository"



export interface RegisterNewCatergoryRequest{
    title:string
    image_path:string|undefined
    
}

export class RegisterNewCategory {
     constructor (private CategoryRepository:CategoryRepository){}

     async execute({image_path,title}:RegisterNewCatergoryRequest) {
         const category = await this.CategoryRepository.create({
            titulo:title,
            image_path:image_path
         })
       return {
        category
       }    
     }
}