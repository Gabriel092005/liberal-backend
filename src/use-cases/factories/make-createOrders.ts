import { PrismaOrderRepository } from '@/repositories/prisma/prisma-pedidos-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { CreateNewOrderUseCase } from '../NewOrder';
import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notification-repository';


export function  makeNewOrderUserCase(){
    const orderRepository = new PrismaOrderRepository()
    const usersRepository = new PrismaUserRepository()
    const notificationRepository  = new PrismaNotificationRepository()
    const UseCase = new CreateNewOrderUseCase(orderRepository,notificationRepository,usersRepository)
    return UseCase
}