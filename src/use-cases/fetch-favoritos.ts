// src/use-cases/favoritos/fetch-favoritos-use-case.ts
import { FavoritosRepository } from "@/repositories/favoritos-repository";

interface FetchFavoritosRequest {
  clienteId: number;
  search:string|undefined
}

export class FetchFavoritosUseCase {
  constructor(private favoritosRepository: FavoritosRepository) {}

  async execute({ clienteId , search}: FetchFavoritosRequest) {
    const favoritos = await this.favoritosRepository.fetchFavoritePrestadores(clienteId, search);
    return { favoritos };
  }
}
