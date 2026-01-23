import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { markNotificationsAsSeenController } from "./markNotification";
import { verifyJWT } from "../middleware/verify-jwt";
import webPush from 'web-push'
import z from "zod";
import prisma from "@/lib/prisma";

const publickey = 'BMOD8Q_9b57EKFwF824qRBb6qdzFEEHWqLhX99taLROqEnKwIcyEDdqcXmRHIqDAxQlCeJe5udSDInEx21TKqeE'
const privatekey = 'cXVWrl3L1DczeGqkMSRSv1U1ELv_ddu_w4sWzUIxo-w'

webPush.setVapidDetails(
    'mailto:seu-email@exemplo.com',
     publickey,
     privatekey
)

export async function NotificacaoRoutes(app:FastifyInstance) {  
    app.get('/push/public_key',()=>{
        return {
             publickey
        }
    })

   

    app.addHook('onRequest', verifyJWT);

  app.post('/push/register', async (req, reply) => {
    const schema = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    });

    // No seu Controller de Register (Backend)
const { subscription } = schema.parse(req.body) 
try {
  
await prisma.usuario.update({
  where: { id: Number(req.user.sub) }, // ID do usuário logado
  data: { 
    pushSubscription: subscription // O Prisma aceita o objeto se o campo for tipo Json
  }
});
   return reply.status(201).send({ message: "Inscrição salva com sucesso!" });
  
 } catch (error) {
     console.error("ERRO NO REGISTRO:", error); // Isso vai mostrar o erro real no terminal do VS Code
    return reply.status(500).send({ error: "Erro interno ao salvar inscrição" })
 }


//testar app - amanha


   

  });
    app.patch("/notifications/mark-as-seen",{onRequest:[verifyJWT]}, markNotificationsAsSeenController);
}