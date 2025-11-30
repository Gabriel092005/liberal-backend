
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { PrismaNotificationRepository } from "@/repositories/prisma/prisma-notification-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-pedidos-repository";
import { PrismaCarteira } from "@/repositories/prisma/prisma-carteira-repository";
import { PrismaHistoricoRecargasRepository } from "@/repositories/prisma/prisma-historicoRecargas";
import { PrismaTransacaoRepository } from "@/repositories/prisma/prisma-Transaction-repository";
import { PromoverPerfilUseCase } from "../colocar-na-vitrine";
import { PrismaPostsVirineRepository } from "@/repositories/prisma/prisma-vitrine-repository";


export function makeColocarNaVitrine(){
      const VitrineRepository= new PrismaPostsVirineRepository()
      const usersRepository = new PrismaUserRepository()
      const notificationRepository = new PrismaNotificationRepository()
      const pedidosRepository = new PrismaOrderRepository()
      const recargasRepository = new PrismaHistoricoRecargasRepository()
      const carteiraRepository = new PrismaCarteira()
      const transacaoRepository =new PrismaTransacaoRepository()
      
      const useCase = new PromoverPerfilUseCase(
          notificationRepository,
          usersRepository,
          carteiraRepository,
          recargasRepository,
          VitrineRepository,
          transacaoRepository

      )
      return useCase
}