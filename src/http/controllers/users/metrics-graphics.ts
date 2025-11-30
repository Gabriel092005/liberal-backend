// src/http/controllers/admin/get-monthly-sales-controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaMetricsRepository } from "@/repositories/prisma/prisma-metrics-repository";
import { GetMonthlySalesUseCase } from "@/use-cases/graphics-metrics";


export async function getMonthlySalesController(req: FastifyRequest, reply: FastifyReply) {
  const metricsRepo = new PrismaMetricsRepository();
  const getMonthlySalesUseCase = new GetMonthlySalesUseCase(metricsRepo);

  const data = await getMonthlySalesUseCase.execute();

  return reply.send({
    data,
  });
}
