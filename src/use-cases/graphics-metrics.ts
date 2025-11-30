// src/use-cases/get-monthly-sales-use-case.ts

import { PrismaMetricsRepository } from "@/repositories/prisma/prisma-metrics-repository";

export class GetMonthlySalesUseCase {
  constructor(private metricsRepository: PrismaMetricsRepository) {}

  async execute() {
    return await this.metricsRepository.getMonthlySales();
  }
}
