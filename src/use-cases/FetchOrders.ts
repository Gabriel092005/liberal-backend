import { OrderRepository } from "@/repositories/pedidos-repository"
import { Pedido } from "@prisma/client"
import { th } from "date-fns/locale"


interface FetchOrdersRequst{
      authorId:number
      query:string|undefined
}

interface FetchOrdersResponse{
    orders:Pedido[]
}

export class FetchOrdersUseCase {
     constructor(private ordersRepositoy:OrderRepository){}

     async execute({authorId,query}:FetchOrdersRequst):Promise<FetchOrdersResponse>{
        const orders = await this.ordersRepositoy.FindMyOrders(authorId,query)

        return{
            orders
        }
     }
}