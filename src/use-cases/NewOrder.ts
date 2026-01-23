import { NotificationService } from "@/http/controllers/services/notification-service"
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { NotificationRepository } from "@/repositories/notificacao-repository"
import { OrderRepository } from "@/repositories/pedidos-repository"
import { usersRepository } from "@/repositories/users-repository"
import { io } from "@/server"
import { Pedido } from "@prisma/client"

// 1 - Fazer Pedido 
// 2 - Buscar todos prestadores proximos 4 desse pedido proximos 
// 3 - Notificar os 4 prestadores mais  desse pedido

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
          private notificationRepository:NotificationRepository,
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
           io.to(String(order.usuarioId)).emit("order", order)
           const  prestadoresProximos = await this.usersRepository.FindNearPrestadores(order.latitude, order.longitude, order.title);
           console.log("prestadores proximos:", prestadoresProximos)
          
           if (prestadoresProximos.length > 0) {
  await Promise.all(
    prestadoresProximos.map(async (prestador) => {
      const contentParaPrestador = `Nova oportunidade de ${order.title} proxímo de você. Clique para ver detalhes!`;
      
      try {
        await this.notificationRepository.Notificar(
          contentParaPrestador,
          Number(prestador.id),
          order.image_path // O prestador vê a foto do serviço/produto
        );

        io.to(String(prestador.id)).emit("order_call", {
        id: order.id,
        title: order.title,
        location: order.location,
        description: order.content,
        authorName: user.nome, // Nome de quem pediu
        brevidade: order.brevidade
      });
      
      console.log(`📡 Sinal de chamada enviado para o prestador: ${prestador.id}`);

        console.log("✔🚀 Notificacao enviada para todos pretadores")

        // Se você tiver serviço de Push (FCM), dispare aqui também
        if (prestador.fcm_token) {
          //  this.fcmService.send(prestador.fcm_token, "Trabalho Próximo!", contentParaPrestador);
        }
      } catch (error) {
        console.error(`Erro ao notificar prestador ${prestador.id}:`, error);
      }
    })
  );
}

const notificações = prestadoresProximos.map(prestador => {
  return NotificationService.send(
    prestador.id, 
    "Novo Trabalho Próximo! 📍", 
    `Há um serviço de ${order.title} perto de você.`,
    `/ordens/${order.id}` // Passando a URL para o prestador clicar e já cair na ordem
  );
});

// Executa todos em paralelo de forma segura
await Promise.allSettled(notificações);

          return {
            order
          }
     }
}