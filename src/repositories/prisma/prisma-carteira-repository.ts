import { prisma } from "@/lib/prisma";
import {  CarteiraRepoitory } from "../carteira-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { HistoricoRecargas, Pacotes } from "@prisma/client";

export class PrismaCarteira implements CarteiraRepoitory {
   async findAllPackagesHistory(
    carteiraId: number
  ): Promise<(HistoricoRecargas & { pacote: Pacotes })[]> {
    return prisma.historicoRecargas.findMany({
      where: {
        carteiraId,
      },
      include: {
        pacote: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  
async deleteExpiredPackages(userId: number): Promise<void> {
  const agora = new Date();

  // 1️⃣ Buscar a carteira do usuário
  const carteira = await prisma.carteira.findFirst({
    where: { usuarioId: userId },
  });

  if (!carteira) {
    console.log("❌ Nenhuma carteira encontrada para este usuário.");
    return;
  }

  // 2️⃣ Buscar pacotes não expirados com validade vencida
  const pacotesExpirados = await prisma.historicoRecargas.findMany({
    where: {
      carteiraId: carteira.id,
      isExpired: false,
      expires_at: { lt: agora }, // 👈 aqui compara a data
    },
  });

  console.log(`Pacotes vencidos encontrados: ${pacotesExpirados.length}`);

  if (pacotesExpirados.length === 0) {
    console.log("Nenhum pacote expirado encontrado.");
    return;
  }

  // 3️⃣ Atualizar todos os pacotes vencidos
  await prisma.historicoRecargas.updateMany({
    where: {
      id: { in: pacotesExpirados.map((p) => p.id) },
    },
    data: {
      isExpired: true,
    },
  });

  console.log("✅ Pacotes expirados atualizados com sucesso!");
}



   async findByUserId(userId: number) {
    const carteira = await prisma.carteira.findFirst({
      where: { usuarioId:Number(userId) },
    })
    return carteira
  }
  async FindDigitalCardDates(userId: number) {
    const carteira = await prisma.carteira.findFirst({
      where: { usuarioId: userId},
      include: {
        usuario: { select: { nome: true } },
      },
    });

    return carteira;
  }

  async updateSaldo(carteiraId: number, novoSaldo: Decimal) {

   const carteira = await prisma.carteira.update({
    where: { id: Number(carteiraId) },
    data: { receita: novoSaldo ,  },
  })
  


  

  return carteira
  }

  
}
