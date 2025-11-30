import { PrismaHistoricoRecargasRepository } from "@/repositories/prisma/prisma-historicoRecargas";

interface GetHistoricoRecargasRequest {
  carteiraId?: number;
}

export class GetHistoricoRecargasUseCase {
  constructor(
    private historicoRepository: PrismaHistoricoRecargasRepository
  ) {}

  async execute({ carteiraId }: GetHistoricoRecargasRequest) {
      const historico = await this.historicoRepository.findByCarteiraId(carteiraId)
    if (carteiraId) {
      return this.historicoRepository.findManyByCarteira(carteiraId);

    }
 


    return this.historicoRepository.findAll();
  }
}
