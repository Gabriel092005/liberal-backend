import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { OrderRepository } from "@/repositories/pedidos-repository"
import { usersRepository } from "@/repositories/users-repository"
import { io } from "@/server"
import { Pedido } from "@prisma/client"

interface CreateNewOrderRequest {
     authorId:number,
     title:string,
     location:string
     content:string,
     image_path:string|undefined,
     brevidade:'URGENTE'|'BAIXO'|'MEDIO'
     latitude:number,
     longitude:number

}
interface CreateNewOrderResponse {
     order:Pedido
}

export class CreateNewOrderUseCase {
     constructor(
        private OrderRepository:OrderRepository,
         private usersRepository:usersRepository
    ){}

     async execute({
        authorId,
        content,
        image_path,
        latitude,
        location,
        longitude,
        title,
        brevidade}:CreateNewOrderRequest):Promise<CreateNewOrderResponse>{
          const user = await this.usersRepository.findById(authorId)
          if(!user){
              throw new resourceNotFoundError()
          }
          console.log(user)
          Number(latitude)
          const order = await this.OrderRepository.Create({
            title,
            content,
            latitude,
            longitude,
            location,
            image_path:user.image_path,
            brevidade,
            autor:{
                connect:{
                    id:user.id
                }
            }
          })
            if(user.role==='PRESTADOR_COLECTIVO' || user.role==='PRESTADOR_INDIVIDUAL'){
             throw Error('Only Costumer can create an orders')
         }
         
           io.to(String(order.usuarioId)).emit("order", order);


          return {
            order
          }
     }
}