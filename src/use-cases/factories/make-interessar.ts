import { PrismaInteresseRepository } from "@/repositories/prisma/prisma-interesse-repository";
import { InteresseUseCase } from "../InteressarUseCase";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { PrismaNotificationRepository } from "@/repositories/prisma/prisma-notification-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-pedidos-repository";
import { PrismaCarteira } from "@/repositories/prisma/prisma-carteira-repository";
import { PrismaHistoricoRecargasRepository } from "@/repositories/prisma/prisma-historicoRecargas";
import { PrismaTransacaoRepository } from "@/repositories/prisma/prisma-Transaction-repository";


export function makeInteressar(){
      const InteresseRepository= new PrismaInteresseRepository()
      const usersRepository = new PrismaUserRepository()
      const notificationRepository = new PrismaNotificationRepository()
      const pedidosRepository = new PrismaOrderRepository()
      const recargasRepository = new PrismaHistoricoRecargasRepository()
      const carteiraRepository = new PrismaCarteira()
      const transacaoRepository =new PrismaTransacaoRepository()
      
      const useCase = new InteresseUseCase(
            InteresseRepository,
            notificationRepository,
            usersRepository,
            pedidosRepository,
            carteiraRepository,
            recargasRepository,
            transacaoRepository

      )
      return useCase
}