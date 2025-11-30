import { HistoricoRecargas } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface createHistoricoTypes {
    carteiraId: number,
    pacoteId: number,
    catergoy:'INCOME'|'OUTCOME'
    valor: Decimal,
    expires_at:Date |null
    transacaoId: number,
    isExpired:boolean
}

export interface historicoRepository {
     create(data:createHistoricoTypes):Promise<HistoricoRecargas>
     findRecarga(recargaId:number):Promise<HistoricoRecargas>
}