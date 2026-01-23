import webPush from 'web-push';
import prisma from "@/lib/prisma";

// Tipagem para garantir consistência entre Backend e Frontend
interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}
const publickey = 'BMOD8Q_9b57EKFwF824qRBb6qdzFEEHWqLhX99taLROqEnKwIcyEDdqcXmRHIqDAxQlCeJe5udSDInEx21TKqeE'
const privatekey = 'cXVWrl3L1DczeGqkMSRSv1U1ELv_ddu_w4sWzUIxo-w'

webPush.setVapidDetails(
  'mailto:suporte@seusite.com', 
  publickey,
  privatekey
);

export class NotificationService {
  static async send(userId: number, title: string, content: string, path: string = '/') {
    try {
      // 1. Histórico no Banco
      await prisma.notificacao.create({
        data: { authrId: userId, content: content }
      });

      // 2. Busca Inscrição
      console.log("userId:", userId)
      const user = await prisma.usuario.findFirst({
        where: { id: userId },
        select: { pushSubscription: true }
      });

      console.log("push-users:", user)

      if (!user?.pushSubscription) return;

      const payload = JSON.stringify({
        title,
        body: content,
        url: path,
        tag: 'novo-servico-proximo' // Tag fixa para não empilhar 10 notificações iguais
      });


const subscription = typeof user.pushSubscription === 'string' 
  ? JSON.parse(user.pushSubscription) 
  : user.pushSubscription;

await webPush.sendNotification(subscription, payload);


    } catch (error: any) {
      // Trata erro de DNS/Internet sem crashar o Node
      if (error.code === 'ENOTFOUND') {
        console.error("Falha de DNS: Verifique a conexão com fcm.googleapis.com");
      } else if (error.statusCode === 410 || error.statusCode === 404) {
        // Token expirou ou usuário desinstalou: Limpamos o banco
        await prisma.usuario.update({
          where: { id: userId },
          data: { pushSubscription: '' }
        });
      }
    }
  }
}