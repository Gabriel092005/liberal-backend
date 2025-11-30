import { CategoryRepository } from "@/repositories/category-repository";
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { usersRepository } from "@/repositories/users-repository";
import { category } from "@prisma/client";


interface CreateAnewCategoryRequest{
    userId:number,
    categoryId:number
    image_path:string,
}



export class UpdatePhotoCategoryUseCase {
     constructor(
        private categoyRepository:CategoryRepository,
        private usersRepository:usersRepository

     ){}

     async execute({image_path,userId,categoryId}:CreateAnewCategoryRequest)
     {
             const user  = await this.usersRepository.findById(userId) 

             if(!user){
                 throw new resourceNotFoundError()
             }
             if(user.role!=='ADMIN'){
                  throw new Error("can not update a new category");
             }
             await this.categoyRepository.updateCategoryPhoto(image_path,categoryId,)

         
     }
}

