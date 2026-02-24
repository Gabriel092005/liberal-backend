import { prisma } from "@/lib/prisma";
import { CarteiraComUsuario, CarteiraRepoitory } from "../carteira-repository"; // Corrigido o typo de Repoitory se necessário
import { Decimal } from "@prisma/client/runtime/library";
import { HistoricoRecargas, Pacotes, Carteira, Transacao } from "@prisma/client";


export class PrismaCarteira implements CarteiraRepoitory {
  
  // Busca o histórico completo com o pacote relacionado
// No arquivo de implementação (PrismaHistoricoRepository)
async findAllPackagesHistory(carteiraId: number): Promise<(HistoricoRecargas & { 
  pacote: Pacotes; 
  transacao: Transacao | null 
})[]> {
  return prisma.historicoRecargas.findMany({
    where: { carteiraId: Number(carteiraId) },
    include: { 
      pacote: true, 
      transacao: true // Isso agora bate com o Promise acima
    },
    orderBy: { created_at: "desc" },
  });
}
  // REGRA 2: Lógica de expiração
  async deleteExpiredPackages(userId: number): Promise<void> {
    const agora = new Date();
    const carteira = await this.findByUserId(userId);

    if (!carteira) return;

    // Busca pacotes que venceram mas ainda não foram marcados como expirados
    const pacotesExpirados = await prisma.historicoRecargas.findMany({
      where: {
        carteiraId: carteira.id,
        isExpired: false,
        expires_at: { lt: agora },
      },
    });

    if (pacotesExpirados.length > 0) {
      await prisma.historicoRecargas.updateMany({
        where: { id: { in: pacotesExpirados.map((p) => p.id) } },
        data: { isExpired: true },
      });
    }
  }

  async findByUserId(userId: number): Promise<Carteira | null> {
    return prisma.carteira.findFirst({
      where: { usuarioId: Number(userId) },
    });
  }

  // Retorna os dados para o cartão digital (incluindo a validade)
  // Adicione o retorno explícito : Promise<CarteiraComUsuario | null>
async FindDigitalCardDates(userId: number): Promise<CarteiraComUsuario | null> {
  const carteira = await prisma.carteira.findFirst({
    where: { usuarioId: Number(userId) },
    include: {
      usuario: { 
        select: { nome: true } 
      },
    },
  });

  // O 'as any' ou 'as CarteiraComUsuario' resolve o conflito de tipos do Prisma
  return carteira as CarteiraComUsuario | null;
}
  // Apenas saldo (usado para a REGRA 1 - Desconto no Unlock)
  async updateSaldo(carteiraId: number, novoSaldo: Decimal) {
    return prisma.carteira.update({
      where: { id: Number(carteiraId) },
      data: { receita: novoSaldo },
    });
  }

  // REGRA 2, 3 e 4: Atualiza Saldo e a data de expiração da carteira
  async updateSaldoEValidade(carteiraId: number, novoSaldo: Decimal, novaData: Date) {
    return prisma.carteira.update({
      where: { id: Number(carteiraId) },
      data: { 
        receita: novoSaldo,
        expiraEm: novaData // Certifique-se que este campo existe no seu schema.prisma
      },
    });
  }
}