import { Favoritos } from "@prisma/client";

export interface CreateFavoritoData {
  clienteId: number;
  prestadorId: number;
}

export interface UsuarioFavorito {
  id: number;
  nome: string;
  celular: string;
  profissao: string;
  image_path: string | null;
  provincia: string;
  municipio: string;
}

export interface FavoritoCustom {
  id: number;
  created_at: Date;
  prestador: UsuarioFavorito;
}

export interface FavoritosRepository {
     remove(clienteId: number, prestadorId: number): Promise<void>
  create(data: CreateFavoritoData): Promise<Favoritos>; // retorna o modelo Prisma padrão
  findByClienteAndPrestador(
    clienteId: number,
    prestadorId: number
  ): Promise<Favoritos | null>;

  fetchFavoritePrestadores(clienteId: number, search:string|undefined): Promise<FavoritoCustom[]>;
}
