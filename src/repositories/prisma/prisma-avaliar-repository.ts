import { prisma } from "@/lib/prisma";
import { AvaliacaoRepository } from "../avaliar-prisma";



export class PrismaAvalaliacaoRepository implements AvaliacaoRepository{
async findByClienteAndPrestador(clienteId: number, prestadorId: number) {
  return await prisma.avaliacao.findFirst({
    where: { clienteId:Number(clienteId) , prestadorId:Number(prestadorId) },
  });
}
async create(data: { clienteId: number; prestadorId: number; nota: number; comentario?: string }) {
  return await prisma.avaliacao.create({ data });
}
async findAllByPrestador(prestadorId: number) {
  return await prisma.avaliacao.findMany({ where: { prestadorId:Number(prestadorId) } });
}
}