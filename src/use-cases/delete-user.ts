import { invalidCredentialsError } from "@/repositories/errors/invalid-credentials"
import { usersRepository } from "@/repositories/users-repository"


interface GetUserProfileUseCaseRequest{
    userId : number
}




export class DeleteUsersUseCase{
    constructor(private usersRepository:usersRepository){}
    async execute
    ({userId} : GetUserProfileUseCaseRequest){
        const user = await this.usersRepository.findById(userId)
        if(!user){
           throw new  Error("Usuario nao encontrado")
        }
        await this.usersRepository.delete(userId)
        return {
            user,
        }
    }
}