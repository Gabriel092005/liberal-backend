// @/use-cases/factories/make-vitrine-engagement.ts
import { PrismaPostsVirineRepository } from "@/repositories/prisma/prisma-vitrine-repository";
import { ToggleLikeUseCase } from "../toggleLikeUseCase";
import { CommentUseCase } from "../commentVitrineUseCase";


const repository = new PrismaPostsVirineRepository();

export function makeToggleLikeUseCase() {
  return new ToggleLikeUseCase(repository);
}

export function makeCommentUseCase() {
    return new CommentUseCase(repository);
  }
