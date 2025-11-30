import { pacotesRepository } from "@/repositories/pacotes-repository";
import { usersRepository } from "@/repositories/users-repository";
import { Pacotes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface createNewPackageRequest{
                        data :{
                            preco : number,
                    userId:number,
                    title:string,
                    validade:string,
                    beneficio1:string|undefined,
                    beneficio2:string|undefined,
                    beneficio3:string|undefined
                        }
}

interface createNewPackageResponse{
    pacote:Pacotes
}




export class createNewPackageUseCase {
     constructor( private packageRepository:pacotesRepository,
                  private usersRepository:usersRepository

     ){}
    async execute({data}:createNewPackageRequest):Promise<createNewPackageResponse>{
        const {
            preco,
            title,
            userId,
            beneficio1,
            beneficio2,
            beneficio3,
            validade
        } = data       
        const admin =  await this.usersRepository.findById(userId)
        
        if(!admin){
             throw new Error("user do not exists,please create account fisrt")
        }
        // if(admin.role!=='ADMIN'){
        //       throw new Error("you can not create a new package")
        // }
        const pacote = await this.packageRepository.createNewPackage({
            data:{
                preco:Number(preco),
                title,
                validade,
                beneficio1,
                beneficio2,
                beneficio3
            }
        }) 
          return{
            pacote
          }
    }
}