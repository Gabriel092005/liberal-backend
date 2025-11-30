import { CategoryRepository } from "@/repositories/category-repository";
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { usersRepository } from "@/repositories/users-repository";
import { category } from "@prisma/client";


interface CreateAnewCategoryRequest{
    title:string,
    userId:number
    image_path?:string,
}

interface CreateAnewCategoryResponse{
  category:category
}

export class CreateAnewCategoryUseCase {
     constructor(
        private categoyRepository:CategoryRepository,
        private usersRepository:usersRepository

     ){}

     async execute({image_path,title,userId}:CreateAnewCategoryRequest):Promise<CreateAnewCategoryResponse>
     {
             const user  = await this.usersRepository.findById(userId) 

             if(!user){
                 throw new resourceNotFoundError()
             }
             if(user.role!=='ADMIN'){
                  throw new Error("can not create a new category");
             }
             const category = await this.categoyRepository.create({
                titulo:title,
                image_path
             })

             return{
                category
             }
     }
}

