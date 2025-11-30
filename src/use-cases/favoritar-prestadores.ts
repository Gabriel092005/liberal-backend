
import { FavoritosRepository } from "@/repositories/favoritos-repository"
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { Favoritos } from "@prisma/client"
import { usersRepository } from "@/repositories/users-repository"

interface CreateFavoritoUseCaseRequest {
  clienteId: number
  prestadorId: number
}

interface CreateFavoritoUseCaseResponse {
  favorito: Favoritos
}

export class CreateFavoritoUseCase {
  constructor(
    private favoritosRepository: FavoritosRepository,
    private usersRepository: usersRepository,
  ) {}

  async execute({ clienteId, prestadorId }: CreateFavoritoUseCaseRequest): Promise<CreateFavoritoUseCaseResponse> {
    const exists = await this.favoritosRepository.findByClienteAndPrestador(clienteId, prestadorId)
    if (exists) throw new Error("Este prestador já está nos favoritos!")
        const user = await this.usersRepository.findById(clienteId)
    if(!user){
        throw new resourceNotFoundError()
    }

    if(user.role ==='PRESTADOR_COLECTIVO' || user.role ==='PRESTADOR_INDIVIDUAL'){
         throw new Error("only costumer can to update user as favorite")
    }

        

    const favorito = await this.favoritosRepository.create({ clienteId, prestadorId })
    return { favorito }
  }
}
