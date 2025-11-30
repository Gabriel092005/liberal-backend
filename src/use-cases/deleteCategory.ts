import { CategoryRepository } from "@/repositories/category-repository";
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { usersRepository } from "@/repositories/users-repository";



interface DeleteCategoryRequest{
    userId:number
    categoryId:string
}



export class DeleteCategoryUseCase {
     constructor(
        private categoyRepository:CategoryRepository,
        private usersRepository:usersRepository

     ){}

     async execute({categoryId,userId}:DeleteCategoryRequest):Promise<null>
     {
             const user  = await this.usersRepository.findById(userId) 

             if(!user){
                 throw new resourceNotFoundError()
             }
             if(user.role!=='ADMIN'){
                  throw new Error("can not create a new category");
             }
              await this.categoyRepository.delete(categoryId)

             return null
     }
}

