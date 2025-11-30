// src/repositories/prisma/prisma-metrics-repository.ts
import { prisma } from "@/lib/prisma";

export class PrismaMetricsRepository {
  async getMonthlySales() {
    const transacoes = await prisma.transacao.findMany({
      select: {
        valor: true,
        created_at: true,
      },
    });

    // Nomes dos meses em português
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    // Agrupar vendas por mês
    const vendasPorMes: Record<string, number> = {};

    for (const t of transacoes) {
      const data = new Date(t.created_at);
      const mes = data.getMonth(); // 0 = Janeiro
      const key = `${mes}`;

      vendasPorMes[key] = (vendasPorMes[key] || 0) + Number(t.valor);
    }

    // Converter em array formatado
    const graphics = Object.entries(vendasPorMes).map(([mesIndex, total]) => ({
      mounth: meses[Number(mesIndex)],
      amount: total,
    }));

    return graphics;
  }
}
