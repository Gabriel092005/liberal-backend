
import { Notificacao, Pedido, Prisma, Usuario }  from "@prisma/client";



export interface NotificationRepository {
 
 Notificar(
    content: string,
    authorId: number | null,
    image: string | null
  ): Promise<null>;

    update(userId:number):Promise<null>
    findMyNotifications(userId: number): Promise<Notificacao[]>;
    findNotifications(): Promise<Notificacao[]>;
}
