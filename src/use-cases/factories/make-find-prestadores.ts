import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FindPrestadoresUseCase } from "../fetch-all-prestadores";

export function makeFindPrestadores() {
  const repository = new PrismaUserRepository();
  const useCase = new FindPrestadoresUseCase(repository);
  return useCase;
}
