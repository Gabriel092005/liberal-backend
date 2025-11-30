import { PrismaPostsVirineRepository } from "@/repositories/prisma/prisma-vitrine-repository";
import { FindManyPostsVitrineUseCase } from "../FetchMyVitrinePosts";
import { FindManyPostsVitrineAllUseCase } from "../fetch-all-vitrinePosts";


export function makeFindManyAllVitrine() {
  const vitrineRepository = new PrismaPostsVirineRepository();
  const useCase = new FindManyPostsVitrineAllUseCase(vitrineRepository);

  return useCase;
}
