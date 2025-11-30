import { PrismaCarteira } from "@/repositories/prisma/prisma-carteira-repository";
import { PrismaHistoricoRecargasRepository } from "@/repositories/prisma/prisma-historicoRecargas";
import { PrismaTransacaoRepository } from "@/repositories/prisma/prisma-Transaction-repository";
import { RecarregarCarteiraUseCase } from "../carregarCarteira";
import { PrismaPacotesRepository } from "@/repositories/prisma/prisma-pacotes-repository";


export function makeRecarregarCarteira(){
     const carteiraRepository = new PrismaCarteira()
     const transacaoRepository = new PrismaTransacaoRepository()
     const pacotesRepository = new PrismaPacotesRepository()
     const historicoRepository = new PrismaHistoricoRecargasRepository()
     const useCase = new RecarregarCarteiraUseCase(carteiraRepository,transacaoRepository,pacotesRepository,historicoRepository)
       return useCase
    }