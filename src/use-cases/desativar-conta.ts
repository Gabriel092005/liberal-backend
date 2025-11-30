import { usersRepository } from "@/repositories/users-repository";

interface DesativarContaRequest{
    userId:number
}

export class DesativarContaUseCase {
     constructor( private usersRepository:usersRepository){}
     async execute({userId}:DesativarContaRequest){
        await this.usersRepository.DesativarConta(userId)
        return null
     }
}