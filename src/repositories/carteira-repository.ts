import { Carteira, HistoricoRecargas, Pacotes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";



export interface CarteiraComUsuario {
  id: number;
  receita: Decimal;
  created_at: Date;
  validade: string | null;
  usuarioId: number;

  usuario: {
    nome: string;
  };
}

export interface CarteiraRepoitory {

   findAllPackagesHistory(carteiraId: number): Promise<(HistoricoRecargas & { pacote: Pacotes })[]>;   FindDigitalCardDates(userId: number): Promise<CarteiraComUsuario | null>
   findByUserId(userId: number) :Promise<Carteira|null>
   updateSaldo(carteiraId: number, novoSaldo: Decimal) :Promise<Carteira>
}