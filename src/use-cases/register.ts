import { UserAreadyExistsError } from "@/repositories/errors/user-already-exists-error";
import { usersRepository } from "@/repositories/users-repository";
import { Usuario} from "@prisma/client";


interface  RegisterUseCaseRequest{
    nome:string;
    celular:string
    image_path:string|undefined
    nif:string
    profissao:string
    palavraPasse:string
    latitude:number|undefined,
    longitude:number | undefined,
    provincia:string,
    municipio:string,
    nomeRepresentante:string|undefined
    Role:'ADMIN'|'PRESTADOR_INDIVIDUAL'|'PRESTADOR_COLECTIVO'|'CLIENTE_COLECTIVO'|'CLIENTE_INDIVIDUAL'

}
interface RegisterUseCaseResponse{
    user:Usuario
}
export class RegisterUseCase {
    constructor( private usersRepository : usersRepository ) { }
 async Execute({
    nome,
    image_path,
    celular,
    nif,
    municipio,
    nomeRepresentante,
    palavraPasse,
    Role,
    latitude,
    longitude,
    profissao,
    provincia} : RegisterUseCaseRequest)

 : Promise<RegisterUseCaseResponse>
{


    //  const userWithSameEmail = await this.usersRepository.findByEmail(email)
     const userWithPhoneNumber = await this.usersRepository.findByPhone(celular)
     const userWithNif = await this.usersRepository.findByNif(nif)

     
   if(userWithNif){
    throw new UserAreadyExistsError()
  }
   if(userWithPhoneNumber){
    throw new UserAreadyExistsError()
  }
  // if(userWithSameEmail){
  //   throw new UserAreadyExistsError()
  // }

    const user = await this.usersRepository.Create({
        celular:celular,
        municipio,
        nif,
        nome,
        image_path,
        profissao,
        palavraPasse,
        provincia,
        latitude,
        longitude,
        nomeRepresentante,
        role:Role,
    })
   
   return {
    user
   }
  } 

}

