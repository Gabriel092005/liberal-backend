import { PrismaCarteira } from "@/repositories/prisma/prisma-carteira-repository";
import { GetCarteiraDataUseCase } from "../getCreditsCard";


export function makeGetCreditCardData(){
     const CarteiraRepository = new PrismaCarteira()
     const useCase = new GetCarteiraDataUseCase(CarteiraRepository)
     return useCase

}