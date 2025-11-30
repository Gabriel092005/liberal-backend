import { usersRepository } from "@/repositories/users-repository";

interface AtivarContaRequest{
    userId:number
}

export class AtivarContaUseCase {
     constructor( private usersRepository:usersRepository){}

     async execute({userId}:AtivarContaRequest){
        await this.usersRepository.AtivarConta(userId)
        return null
     }
}