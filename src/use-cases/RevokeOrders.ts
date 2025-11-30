
import { OrderRepository } from "@/repositories/pedidos-repository"
interface FetchOrdersRequst{
      pedidoId:number
 
}
export class RevokeOrdersUseCase {
     constructor(private ordersRepositoy:OrderRepository){}
     async execute({pedidoId}:FetchOrdersRequst){
        const orders = await this.ordersRepositoy.delete(pedidoId)
        return{
            orders
        }
     }
}