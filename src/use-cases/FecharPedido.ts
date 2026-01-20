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

export class FetcharPedidoUseCase {
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
             throw Error('Only Costumer can accept orders')
         }
         const pedido = await this.ordersRepository.findById(pedidoId)
         if(!pedido){
            throw new Error("Impossivel fechar um pedido que nao existe!")
         }
         
        await this.ordersRepository.fecharPedido(prestadorId, pedidoId)
        const prestador = await this.usersRepository.findById(prestadorId);
        const content = `${prestador?.nome}, O prestador ${client.nome} aceitou o seu pedido  de ${pedido?.title}`;
        await this.NotificationRepository.Notificar(content, prestadorId, client.image_path)
     
        const notificacao =  await this.NotificationRepository.findMyNotifications(pedido.usuarioId)
                io.emit("user", notificacao);
        return null
         
     }
}