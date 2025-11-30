import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { usersRepository } from "@/repositories/users-repository"


interface CommentarPrestadorRequest{
     content:string
     prestadorId:number
}

export class CommentarPrestadorUseCase {
     constructor(private usersRepository:usersRepository){}

     async execute({content,prestadorId}:CommentarPrestadorRequest):Promise<void>{
         const user = await this.usersRepository.findById(prestadorId)
          if(!user){
               throw new resourceNotFoundError()
          }

          await this.usersRepository.commentarPrestador(prestadorId,content)
     
     }
}