import { PrismaFavoritarRepository } from "@/repositories/prisma/prisma-favoritar"
import { CreateFavoritoUseCase } from "../favoritar-prestadores"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"


export function makeCreateFavoritoUseCase() {
  const favoritosRepository = new PrismaFavoritarRepository()
  const usersRepository = new PrismaUserRepository()
  const useCase = new CreateFavoritoUseCase(favoritosRepository,usersRepository)
  return useCase
}
