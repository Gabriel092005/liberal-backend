import { PrismaOrderRepository } from "@/repositories/prisma/prisma-pedidos-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FetcharPedidoUseCase } from "../FecharPedido";
import { PrismaNotificationRepository } from "@/repositories/prisma/prisma-notification-repository";


export function makeAcceptOrders(){
     const usersRepository = new PrismaUserRepository()
     const ordersRepository = new PrismaOrderRepository()
     const notificacaoRepository = new PrismaNotificationRepository()
     const UseCase = new FetcharPedidoUseCase(ordersRepository,notificacaoRepository,usersRepository,)
     return UseCase
}