import { VitrineRepository } from "@/repositories/virine-repository";
import { Postsvitrine } from "@prisma/client";

interface FindManyPostsVitrineRequest {
  userId: number;
}

interface FindManyPostsVitrineResponse {
  vitrine: Postsvitrine[];
}

export class FindManyPostsVitrineUseCase {
  constructor(private vitrineRepository: VitrineRepository) {}

  async execute({
    userId,
  }: FindManyPostsVitrineRequest): Promise<FindManyPostsVitrineResponse> {
    if (!userId || isNaN(userId)) {
      throw new Error("ID do usuário inválido para busca de vitrine.");
    }

    const vitrine = await this.vitrineRepository.FindManyPostsVitrine(String(userId));

    return { vitrine };
  }
}
