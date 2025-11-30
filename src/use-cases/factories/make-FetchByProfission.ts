import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FetchUsersByProfissionUseCase } from "../FetchUsersByProfission";


export function makeGetFetchUsersByProfissionUseCase(){
      const usersRepository = new PrismaUserRepository()
      const UseCase = new FetchUsersByProfissionUseCase(usersRepository)
      return UseCase
}