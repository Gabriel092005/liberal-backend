import { PrismaPostsVirineRepository } from "@/repositories/prisma/prisma-vitrine-repository";
import { FindManyPostsVitrineUseCase } from "../FetchMyVitrinePosts";


export function makeFindManyVitrine() {
  const vitrineRepository = new PrismaPostsVirineRepository();
  const useCase = new FindManyPostsVitrineUseCase(vitrineRepository);

  return useCase;
}
