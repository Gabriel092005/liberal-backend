import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { NotificationRepository } from "@/repositories/notificacao-repository";
import { OrderRepository } from "@/repositories/pedidos-repository";
import { usersRepository } from "@/repositories/users-repository";
import { io } from "@/server";

interface FecharPedidoRequest{
    clientId:number,
    prestadorId: number;
    pedidoId:number
}

export class InterromperPedidoUseCase {
     constructor(
                 private ordersRepository:OrderRepository,
                 private NotificationRepository:NotificationRepository,
                 private usersRepository:usersRepository

     ){}

     async execute({pedidoId,clientId, prestadorId}:FecharPedidoRequest):Promise<null>{
         const client = await this.usersRepository.findById(clientId)


         if(!client){
             throw new resourceNotFoundError()
         }
         if(client.role==='PRESTADOR_COLECTIVO' || client.role==='PRESTADOR_INDIVIDUAL'){
             throw Error('Only Costumer can revoke orders')
         }
         
         await this.ordersRepository.RevokeOrder(prestadorId, pedidoId)
         
        const prestador = await this.usersRepository.findById(prestadorId);
        const content = `O cliente ${client.nome} cancelou o pedido`;
        const contentAdmin = `O cliente ${client.nome} cancelou o pedido com o ${prestador?.nome}`;
        const admin = await this.usersRepository.findAdminProfile()

        const pedido = await this.ordersRepository.findById(pedidoId)
             if(!pedido || !admin){
            throw new Error("Impossivel fechar um pedido que nao existe!")
         }
         
        await this.NotificationRepository.Notificar(content, prestadorId, client.image_path)
        await this.NotificationRepository.Notificar(contentAdmin, admin.id, null)
     
        const notificacao =  await this.NotificationRepository.findMyNotifications(pedido.usuarioId)
                io.emit("user", notificacao);
         return null
         
     }
}