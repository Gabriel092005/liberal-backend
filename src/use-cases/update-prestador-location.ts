import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { usersRepository } from "@/repositories/users-repository"
import { Usuario } from "@prisma/client"

interface UpdateUserLocationRequest{
    prestadorId:number
    latitude:string
    longitude:string
    location:string|undefined,
}


export class UpdateUserLocationUseCase  {
     constructor ( private usersRepository:usersRepository){}

     async execute({latitude,longitude,location,prestadorId}:UpdateUserLocationRequest){

            const user = await this.usersRepository.findById(prestadorId)

            if(!user){
                 throw new resourceNotFoundError()
                }
                
                const usuario = await this.usersRepository.updatePrestadorLocation(
                 prestadorId,
                 latitude,
                 longitude,
                 location
            )
           


     }
}