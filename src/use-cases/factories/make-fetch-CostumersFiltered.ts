import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FindCustomersUseCase } from "../fetch-users-costumers";

export function makeFindCustomers() {
  const repository = new PrismaUserRepository();
  const useCase = new FindCustomersUseCase(repository);
  return useCase;
}
