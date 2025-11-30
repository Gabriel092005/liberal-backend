import { PrismaOrderRepository } from "@/repositories/prisma/prisma-pedidos-repository";
import { RevokeOrdersUseCase } from "../RevokeOrders";


export function makeRevokeOrders(){
     const orderRepository = new PrismaOrderRepository()
     const UseCase = new RevokeOrdersUseCase(orderRepository)
     return UseCase
}