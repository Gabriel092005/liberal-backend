import { prisma } from "@/lib/prisma";
import { createHistoricoTypes, historicoRepository } from "../historico-repository";
import { HistoricoRecargas } from "@prisma/client";



export class PrismaHistoricoRecargasRepository implements historicoRepository {
async findRecarga(recargaId: number): Promise<HistoricoRecargas> {
  const recarga = await prisma.historicoRecargas.findUnique({
    where: { id: recargaId },
    include: {
      pacote: true,
      carteira: true,
      transacao: true,
    },
  });

  if (!recarga) {
    throw new Error("Recarga não encontrada");
  }
  
  

  return recarga;
}

 async findByCarteiraId(carteiraId: number|undefined): Promise<HistoricoRecargas[]> {
    const historico = await prisma.historicoRecargas.findMany({
      where: { carteiraId },
      include: {
        pacote: true, // inclui detalhes do pacote
        transacao: true, // opcional
      },
      orderBy: {
        created_at: "desc", // mais recentes primeiro
      },
    })

    return historico
  }

  async create(data:createHistoricoTypes) {
    const {carteiraId,pacoteId,transacaoId,valor ,catergoy,isExpired, expires_at} = data
    // const expires_at = new Date(Date.now() + 2 * 60 * 1000); // 2 minutos a partir de agora

const historicoRecargas = await prisma.historicoRecargas.create({
  data: {
    carteiraId,
    pacoteId,
    valor,
    transacaoId,
    isExpired: false,      // inicializa como não expirado
    catergoy: catergoy,    // corrige o typo
    expires_at,            // data de expiração em 2 minutos
  },
});

return historicoRecargas;
  }

   async findManyByCarteira(carteiraId: number) {
    const historico = await prisma.historicoRecargas.findMany({
      where: { carteiraId },
      include: {
        pacote: true,
        transacao: true,
      },
      orderBy: { created_at: "desc" },
    });

    return historico;
  }

  async findAll() {
    return prisma.historicoRecargas.findMany({
      include: {
        carteira: true,
        pacote: true,
        transacao: true,
      },
      orderBy: { created_at: "desc" },
    });
  }
}
