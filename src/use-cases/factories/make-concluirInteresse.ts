// src/use-cases/factories/make-concluir-pedido-use-case.ts
import { PrismaInteresseRepository } from "@/repositories/prisma/prisma-interesse-repository";
import { ConcluirPedidoUseCase } from "../concluirPedidoIntersse";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-pedidos-repository";


export function makeConcluirPedidoUseCase() {
    
  const Interesserepository = new PrismaInteresseRepository();
  const OrderRepository = new PrismaOrderRepository();
  const useCase = new ConcluirPedidoUseCase(OrderRepository,Interesserepository);
  return useCase;

}