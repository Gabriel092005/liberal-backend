import { Notificacao } from "@prisma/client";
import { NotificationRepository } from "../notificacao-repository";
import { prisma } from "@/lib/prisma";

export class PrismaNotificationRepository implements NotificationRepository{
  async findNotifications() {
    const notificacao = await prisma.notificacao.findMany()
    return notificacao
  }
   async update(userId: number){
       await prisma.notificacao.updateMany({
        where:{
         authrId:Number(userId)
        },
        data:{
          AlreadySeen:true
        }
       })
       return null
    
  }
  async Notificar(content: string, authorId: number | null, image: string | null) {
    await prisma.notificacao.create({
      data: {
        content,
        authrId:Number(authorId), // ✅ nome correto
        image
      }
    });
    return null;
    
  }

  async findMyNotifications(userId: number) {
    const notificacoes = await prisma.notificacao.findMany({
      where: {
        authrId: Number(userId), 
      },
      orderBy: { created_at: "desc" }, // opcional: mais recentes primeiro
    });

    return notificacoes;
  }
}

