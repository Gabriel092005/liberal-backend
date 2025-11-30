

import { PrismaOrderRepository } from '@/repositories/prisma/prisma-pedidos-repository';
import { FetchOrdersUseCase } from '../FetchOrders';
import { FetchAllOrdersUseCase } from '../fetch-orders';


export function  makeFetchAllOrderUserCase(){
    const orderRepository = new PrismaOrderRepository()
    const UseCase = new FetchAllOrdersUseCase(orderRepository)
    return UseCase
}