// src/repositories/prisma/prisma-favoritar-repository.ts
import { prisma } from "@/lib/prisma";
import {
  CreateFavoritoData,
  FavoritosRepository,
  FavoritoCustom,
} from "../favoritos-repository";

export class PrismaFavoritarRepository implements FavoritosRepository {
  async remove(clienteId: number, prestadorId: number): Promise<void> {
    const favorito = await prisma.favoritos.findFirst({
      where: { clienteId, prestadorId },
      select: { id: true },
    })

    if (favorito) {
      await prisma.favoritos.delete({
        where: { id: favorito.id },
      })
    }
  }
  async create(data: CreateFavoritoData) {
    return await prisma.favoritos.create({ data });
  }

  async findByClienteAndPrestador(clienteId: number, prestadorId: number) {
    return await prisma.favoritos.findFirst({
      where: { clienteId, prestadorId },
    });
  }

 async fetchFavoritePrestadores(
  clienteId: number,
  search?: string
): Promise<FavoritoCustom[]> {
  const whereClause: any = { clienteId };

  // Se o usuário digitou algo no campo de pesquisa
  if (search && search.trim() !== "") {
    whereClause.prestador = {
      OR: [
        { nome: { contains: search, mode: "insensitive" } },
        { profissao: { contains: search, mode: "insensitive" } },
        { provincia: { contains: search, mode: "insensitive" } },
        { municipio: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const favoritos = await prisma.favoritos.findMany({
    where: whereClause,
    include: {
      prestador: {
        select: {
          id: true,
          nome: true,
          celular: true,
          profissao: true,
          provincia: true,
          municipio: true,
          image_path: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return favoritos.map((favorito) => ({
    id: favorito.id,
    created_at: favorito.created_at,
    prestador: favorito.prestador,
  }));
}

}
