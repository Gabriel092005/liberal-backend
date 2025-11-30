// src/use-cases/interesse/listar-interesses-usecase.ts
import { InteresseRepository } from "@/repositories/interessar-repository";
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";

interface ListInteressesRequest {
  prestadorId: number;
}

interface InteresseComPedido {
  id: number;
  status: string;
  pedido: {
    id: number;
    title: string;
    content: string;
    image_path?: string | null;
    status: string;
    location: string;
    latitude: number;
    longitude: number;
    created_at: Date;
  };
}

export interface ListInteressesResponse {
  interesses: InteresseComPedido[];
}

export class ListInteressesUseCase {
  constructor(private interesseRepository: InteresseRepository) {}

async execute({ prestadorId }: ListInteressesRequest): Promise<ListInteressesResponse> {
  const interessesRaw = await this.interesseRepository.findAllByPrestador(prestadorId);

  if (!interessesRaw || interessesRaw.length === 0) {
    throw new resourceNotFoundError();
  }

  // ✅ Mapear para o tipo que você quer
  const interesses: InteresseComPedido[] = interessesRaw.map(i => ({
    id: i.id,
    status: i.status,
    pedido: i.pedido,
  }));

  return { interesses };
}

}
