
import { pacotesRepository } from "@/repositories/pacotes-repository"
import { Pacotes } from "@prisma/client"

interface FindAllPacotesResponse {
  packages: Pacotes[] | null
}

export class FindAllPacotesUseCase {
  constructor(private pacoteRepository: pacotesRepository) {}

  async execute(): Promise<FindAllPacotesResponse> {
    const packages = await this.pacoteRepository.findPacotes()
    return { packages}
  }
}
