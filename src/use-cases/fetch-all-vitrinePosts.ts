import { VitrineRepository } from "@/repositories/virine-repository";
import { Postsvitrine } from "@prisma/client";

interface FindManyPostsVitrineResponse {
  vitrine: Postsvitrine[];
}

export class FindManyPostsVitrineAllUseCase {
  constructor(private vitrineRepository: VitrineRepository) {}

  async execute(): Promise<FindManyPostsVitrineResponse> {
    const vitrine = await this.vitrineRepository.FindManyAllPostsVitrine();
    return { vitrine };
  }
}
