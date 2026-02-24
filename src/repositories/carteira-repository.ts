import { Carteira, HistoricoRecargas, Pacotes, Transacao } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";



export interface CarteiraComUsuario {
  id: number;
  receita: Decimal;
  created_at: Date;
  ExpiraEm: Date;
  usuarioId: number;

  usuario: {
    nome: string;
  };
}

export interface CarteiraRepoitory {

// Atualize a definição para incluir a transação opcional
findAllPackagesHistory(carteiraId: number): Promise<(HistoricoRecargas & { 
  pacote: Pacotes, 
  transacao: Transacao | null 
})[]>;   FindDigitalCardDates(userId: number): Promise<CarteiraComUsuario | null>
   findByUserId(userId: number) :Promise<Carteira|null>
   updateSaldoEValidade(carteiraId: number, novoSaldo: Decimal, novaData: Date):Promise<Carteira>
}