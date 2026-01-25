// src/use-cases/concluir-pedido-use-case.ts
import { InteresseRepository } from "@/repositories/interessar-repository";
import { OrderRepository } from "@/repositories/pedidos-repository";

interface ConcluirPedidoUseCaseRequest {
  prestadorId: number;
  pedidoId: number;
}

export class ConcluirPedidoUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private interesseRepository:InteresseRepository

  ) {}

  async execute({ prestadorId, pedidoId }: ConcluirPedidoUseCaseRequest) {


    const interesseExistente = await this.interesseRepository.findByUserAndPedido(prestadorId, pedidoId);

    if (!interesseExistente) {
      throw new Error("Você não tem permissão para concluir um pedido que não iniciou negociação.");
    }
    
    const pedidoFinalizadoId = await this.orderRepository.concluirPedidoPrestador(
      prestadorId,
      pedidoId
    );

    return { pedidoFinalizadoId };
  }
}