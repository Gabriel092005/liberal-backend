import { usersRepository } from "@/repositories/users-repository";

interface SuspenderContaRequest{
    userId:number
}

export class SuspenderContaUseCase {
     constructor( private usersRepository:usersRepository){}

     async execute({userId}:SuspenderContaRequest){
        await this.usersRepository.SuspenderConta(userId)
        return null
     }
}