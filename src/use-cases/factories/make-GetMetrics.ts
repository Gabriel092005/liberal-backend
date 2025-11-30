import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { AdminMetrics } from "../Admin-metrics";


export  function makeMetrics() {
     const usersReepository = new PrismaUserRepository()
     const useCase = new AdminMetrics(usersReepository)
     return useCase
    
}