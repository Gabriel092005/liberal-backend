import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GetUserProfileUseCase } from "../profile";
import { GetCommentUseCase } from "../get-comments";


export function makeGetCommentUseCase(){
      const usersRepository = new PrismaUserRepository()
      const UseCase = new GetCommentUseCase(usersRepository)
      return UseCase
}