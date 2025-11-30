import { FavoritosRepository } from "@/repositories/favoritos-repository"

interface RemoveFavoritoUseCaseRequest {
  clienteId: number
  prestadorId: number
}

export class RemoveFavoritoUseCase {
  constructor(private favoritosRepository: FavoritosRepository) {}

  async execute({ clienteId, prestadorId }: RemoveFavoritoUseCaseRequest) {
    const favoritoExiste = await this.favoritosRepository.findByClienteAndPrestador(clienteId, prestadorId)

    if (!favoritoExiste) {
      throw new Error("Este prestador não está nos favoritos")
    }

    await this.favoritosRepository.remove(clienteId, prestadorId)
  }
}
