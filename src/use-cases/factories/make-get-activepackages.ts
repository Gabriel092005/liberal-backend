import { PrismaCarteira } from "@/repositories/prisma/prisma-carteira-repository";
import { ListarHistoricoPacotesUseCase } from "../Listar-pacotes-ativos";


export function makeListarHistoricoPacotesUseCase() {
  const carteiraRepository = new PrismaCarteira();
  const useCase = new ListarHistoricoPacotesUseCase(carteiraRepository);
  return useCase;
}
