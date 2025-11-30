import { prisma } from "@/lib/prisma";
import { usersRepository } from "@/repositories/users-repository";
import { Decimal } from "@prisma/client/runtime/library";

export interface AdminMetricsResponse {
  clientesEmpresa: number;
  clientesIndividual: number;
  prestadoresEmpresa: number;
  prestadoresIndividual: number;
  receitas: Decimal;
  pedidos: number;
  crescimento: {
    clientes: number;
    prestadores: number;
    pedidos: number;
  };
}

export class AdminMetrics {
  constructor(private usersRepository: usersRepository) {}

  async execute(): Promise<AdminMetricsResponse> {
    // === 1️⃣ MÉTRICAS TOTAIS ===
    const [
      clientesEmpresa,
      clientesIndividual,
      prestadoresEmpresa,
      prestadoresIndividual,
    ] = await Promise.all([
      this.usersRepository.totalClientesEmpresa(),
      this.usersRepository.totalClientesIndividual(),
      this.usersRepository.totalPrestadoresEmpresa(),
      this.usersRepository.totalPrestadoresIndividual(),
    ]);

    // Total de entradas (INCOME apenas)
    const receitasAggregate = await prisma.historicoRecargas.aggregate({
      _sum: { valor: true },
      where: {
         catergoy:'INCOME'
      },
    });
    const receitas: Decimal = receitasAggregate._sum.valor ?? new Decimal(0);

    // Total de pedidos
    const pedidos: number = await prisma.pedido.count();

    // === 2️⃣ CÁLCULO DE CRESCIMENTO MENSAL ===
    const agora = new Date();
    const inicioMesAtual = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const inicioMesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);

    const taxaCrescimento = (atual: number, anterior: number) => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return ((atual - anterior) / anterior) * 100;
    };

    // Clientes
    const clientesMesAtual = await prisma.usuario.count({
      where: {
        role: { in: ["CLIENTE_COLECTIVO", "CLIENTE_INDIVIDUAL"] },
        created_at: { gte: inicioMesAtual },
      },
    });
    const clientesMesAnterior = await prisma.usuario.count({
      where: {
        role: { in: ["CLIENTE_COLECTIVO", "CLIENTE_INDIVIDUAL"] },
        created_at: { gte: inicioMesAnterior, lt: inicioMesAtual },
      },
    });

    // Prestadores
    const prestadoresMesAtual = await prisma.usuario.count({
      where: {
        role: { in: ["PRESTADOR_COLECTIVO", "PRESTADOR_INDIVIDUAL"] },
        created_at: { gte: inicioMesAtual },
      },
    });
    const prestadoresMesAnterior = await prisma.usuario.count({
      where: {
        role: { in: ["PRESTADOR_COLECTIVO", "PRESTADOR_INDIVIDUAL"] },
        created_at: { gte: inicioMesAnterior, lt: inicioMesAtual },
      },
    });

    // Pedidos do mês
    const pedidosMesAtual = await prisma.pedido.count({
      where: { created_at: { gte: inicioMesAtual } },
    });
    const pedidosMesAnterior = await prisma.pedido.count({
      where: { created_at: { gte: inicioMesAnterior, lt: inicioMesAtual } },
    });

    const crescimento = {
      clientes: taxaCrescimento(clientesMesAtual, clientesMesAnterior),
      prestadores: taxaCrescimento(prestadoresMesAtual, prestadoresMesAnterior),
      pedidos: taxaCrescimento(pedidosMesAtual, pedidosMesAnterior),
    };

    // === 3️⃣ RETORNO FINAL ===
    return {
      clientesEmpresa,
      clientesIndividual,
      prestadoresEmpresa,
      prestadoresIndividual,
      receitas,
      pedidos,
      crescimento,
    };
  }
}
