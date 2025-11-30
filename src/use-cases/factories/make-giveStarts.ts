import { PrismaAvalaliacaoRepository } from "@/repositories/prisma/prisma-avaliar-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GiveStarsUseCase } from "../giveStarts";


export function makeAvaliarPrestadores(){
      const usersRepository = new PrismaUserRepository();
      const avaliacaoRepository = new PrismaAvalaliacaoRepository();
      const useCase =new GiveStarsUseCase(avaliacaoRepository,usersRepository, )
      return useCase
}