import { PrismaPostsVirineRepository } from "@/repositories/prisma/prisma-vitrine-repository";
import { DeleteVitrineUseCase } from "../delete-vitrine-posts";


export function makeDeleteVitrine(){
    const vitrineRepository = new PrismaPostsVirineRepository()
    const useCase = new DeleteVitrineUseCase(vitrineRepository)
    return useCase
}