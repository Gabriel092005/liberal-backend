import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FetchUPrestadoresDestaquesUseCase } from "../FetchPrestadoresDestaque";


export function makeFetchPrestadoresDestaquesUseCase(){
      const usersRepository = new PrismaUserRepository()
      const UseCase = new FetchUPrestadoresDestaquesUseCase(usersRepository)
      return UseCase
}