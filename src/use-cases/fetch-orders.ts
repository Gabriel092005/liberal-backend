import { OrderRepository } from "@/repositories/pedidos-repository";
import { Pedido } from "@prisma/client";

export interface FetchOrdersResponse {
    orders:Pedido[]
}

interface FetchAllOrdersRequest{
     query:string|undefined
}

export class FetchAllOrdersUseCase {
     constructor( private ordersRepository:OrderRepository){}
    async execute({query}:FetchAllOrdersRequest):Promise<FetchOrdersResponse>{
         const orders = await this.ordersRepository.findAllOrders(query)
         return{
            orders
         }
         
    }
}