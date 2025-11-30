import { invalidCredentialsError } from "@/repositories/errors/invalid-credentials";
import { usersRepository } from "@/repositories/users-repository";
import { Usuario} from "@prisma/client";

 

interface AuthenticateUseCaseRequest{
    phone: string,
    password:string
}

interface  AuthenticateUseCaseResponse {
    user: Usuario
}


export class AuthenticateUseCase{
    constructor(private usersRespository : usersRepository){}
    async execute
        ({phone,password} : AuthenticateUseCaseRequest) : Promise<AuthenticateUseCaseResponse>{
        const user = await this.usersRespository.findByPhone(phone)
        if(!user){
            throw new invalidCredentialsError()
        }
       if(user.palavraPasse!= password){
            throw new invalidCredentialsError()
       }

        return {
            user,
        }
    }
}