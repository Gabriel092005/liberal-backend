import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FetchUPrestadoresUseCase } from "../FetchPrestadores";


export function makeFetchPrestadoresUseCase(){
      const usersRepository = new PrismaUserRepository()
      const UseCase = new FetchUPrestadoresUseCase(usersRepository)
      return UseCase
}