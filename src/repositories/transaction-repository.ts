import { Transacao } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export interface CreateNewTransactionTypes {
           usuarioId: number,
            carteiraId: number,
            pacoteId: number,
            valor: Decimal,
            metodo: string,
            status: string,
            referencia?: string
}


export interface transacaoRepository  {
    findById(userId:number):Promise<Transacao |null>
    create(data:CreateNewTransactionTypes):Promise<Transacao>
    
}