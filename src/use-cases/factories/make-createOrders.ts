import { PrismaOrderRepository } from '@/repositories/prisma/prisma-pedidos-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { CreateNewOrderUseCase } from '../NewOrder';


export function  makeNewOrderUserCase(){
    const orderRepository = new PrismaOrderRepository()
    const usersRepository = new PrismaUserRepository()
    const UseCase = new CreateNewOrderUseCase(orderRepository,usersRepository)
    return UseCase
}