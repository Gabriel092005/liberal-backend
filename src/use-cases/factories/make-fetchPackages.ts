import { PrismaPacotesRepository } from "@/repositories/prisma/prisma-pacotes-repository"
import { FindAllPacotesUseCase } from "../fetch-packages"

export function makeFindAllPacotesUseCase() {
  const pacoteRepository = new PrismaPacotesRepository()
  const useCase = new FindAllPacotesUseCase(pacoteRepository)
  return useCase
}
