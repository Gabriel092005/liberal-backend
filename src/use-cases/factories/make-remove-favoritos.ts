import { PrismaFavoritarRepository } from "@/repositories/prisma/prisma-favoritar"
import { RemoveFavoritoUseCase } from "../remove-prestador-favorito"

export function makeRemoveFavoritoUseCase() {
  const repository = new PrismaFavoritarRepository()
  return new RemoveFavoritoUseCase(repository)
}
