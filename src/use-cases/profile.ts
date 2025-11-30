import { invalidCredentialsError } from "@/repositories/errors/invalid-credentials"
import { usersRepository } from "@/repositories/users-repository"
import { Usuario } from "@prisma/client"

interface GetUserProfileUseCaseRequest{
    userId : number
}

interface  GetUserProfileUseCaseResponse {
   user: Usuario
}


export class GetUserProfileUseCase{
    constructor(private usersRepository:usersRepository){}
    async execute
    ({userId} : GetUserProfileUseCaseRequest) : Promise<GetUserProfileUseCaseResponse>{
 
        const user = await this.usersRepository.findById(userId)

        if(!user){
           throw new  invalidCredentialsError()
        }


        return {
            user,
        }


      
    }


    
}