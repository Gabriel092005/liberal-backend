import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { CreateNewTransactionTypes, transacaoRepository } from "../transaction-repository";
import { Transacao } from "@prisma/client";

export class PrismaTransacaoRepository implements transacaoRepository  {
 async findById(userId: number){
     const transacao = await prisma.transacao.findFirst({
      where:{
        usuarioId:Number(userId)
      }
     })
     return transacao
}
  async create(data:CreateNewTransactionTypes) {
    const {
        carteiraId,
        metodo,
        pacoteId,
        status,
        usuarioId,
        valor,
        referencia
    } = data
    const transacao = await prisma.transacao.create({
      data: {
        usuarioId,
        carteiraId,
        pacoteId,
        valor,
        metodo,
        status,
        referencia,
      },
    });
    return transacao
  }
}
