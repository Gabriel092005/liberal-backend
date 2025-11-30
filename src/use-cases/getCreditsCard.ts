import { CarteiraComUsuario, CarteiraRepoitory } from "@/repositories/carteira-repository";
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { PrismaClient } from "@prisma/client";

interface GetCreditDataCardRequest {
  userId: number;
}

interface GetCreditDataCardResponse {
  carteira: CarteiraComUsuario;
}

export class GetCarteiraDataUseCase {
  constructor(private carteiraRepository: CarteiraRepoitory) {}

  async execute({ userId }: GetCreditDataCardRequest): Promise<GetCreditDataCardResponse> {
    // 1️⃣ Verifica se a carteira existe
    const carteira = await this.carteiraRepository.FindDigitalCardDates(userId);
    
    if (!carteira) {
      throw new resourceNotFoundError();
    }


    const now = new Date();
    // await this.carteiraRepository.deleteExpiredPackages(userId, now);

    // 3️⃣ Retorna a carteira atualizada
    const updatedCarteira = await this.carteiraRepository.FindDigitalCardDates(userId);

    return {
      carteira: updatedCarteira!,
    };
  }
}
