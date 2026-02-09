import { PrismaOrderRepository } from "@/repositories/prisma/prisma-pedidos-repository";
import { GetPedidosStatusUseCase } from "../GetPedidosStatusUseCase";
import { GetPedidosStatusController } from "@/http/controllers/orders/GetPedidosStatusController";

// src/factories/makeGetPedidosStatus.ts
export function makeGetPedidosStatusController() {
    const repository = new PrismaOrderRepository();
    const useCase = new GetPedidosStatusUseCase(repository);
    const controller = new GetPedidosStatusController(useCase);
  
    return controller;
  }