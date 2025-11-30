import { PrismaOrderRepository } from '@/repositories/prisma/prisma-pedidos-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { FetcharPedidoUseCase } from '../FecharPedido';
import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notification-repository';


export function  makeFecharPedidoCase(){
    const orderRepository = new PrismaOrderRepository()
    const NotificationRepository = new PrismaNotificationRepository()
    const usersRepository = new PrismaUserRepository()
    const UseCase = new FetcharPedidoUseCase(orderRepository,NotificationRepository,usersRepository)
    return UseCase
}