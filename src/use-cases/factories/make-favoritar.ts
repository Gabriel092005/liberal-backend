import { PrismaFavoritarRepository } from "@/repositories/prisma/prisma-favoritar";
import { FetchFavoritosUseCase } from "../fetch-favoritos";


export function makeFetchFavoritosUseCase() {
  const favoritosRepository = new PrismaFavoritarRepository();
  const fetchFavoritosUseCase = new FetchFavoritosUseCase(favoritosRepository);
  return fetchFavoritosUseCase;
}
