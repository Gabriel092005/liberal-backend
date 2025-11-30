import { OrderRepository } from "@/repositories/pedidos-repository";

interface FetchNearOrderUseCaseRequest {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export class FetchNearOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ latitude, longitude, radiusKm = 5 }: FetchNearOrderUseCaseRequest) {
    const orders = await this.orderRepository.fetchNearOrder(latitude, longitude);
    return orders;
  }
}
