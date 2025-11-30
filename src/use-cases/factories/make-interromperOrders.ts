import { PrismaOrderRepository } from '@/repositories/prisma/prisma-pedidos-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notification-repository';
import { InterromperPedidoUseCase } from '../Interromper-pedido';


export function  makeInterromperPedidoCase(){
    const orderRepository = new PrismaOrderRepository()
    const NotificationRepository = new PrismaNotificationRepository()
    const usersRepository = new PrismaUserRepository()
    const UseCase = new InterromperPedidoUseCase(orderRepository,NotificationRepository,usersRepository)
    return UseCase
}