import { PrismaOrderRepository } from '@/repositories/prisma/prisma-pedidos-repository';
import { FetchOrdersUseCase } from '../FetchOrders';


export function  makeMyOrderUserCase(){
    const orderRepository = new PrismaOrderRepository()
    const UseCase = new FetchOrdersUseCase(orderRepository)
    return UseCase
}