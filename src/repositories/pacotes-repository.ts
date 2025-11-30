import { Pacotes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";



//   preco      Decimal
//   title      String
//   validade   String
//   beneficio1 String?
//   beneficio2 String?
//   beneficio3 String?

export interface createNewPackageTypes{
    data:{
         preco:number, 
         title:string, 
         validade:string,
         beneficio1?:string,
         beneficio2?:string,
         beneficio3?:string
    }
}

export interface pacotesRepository {
    createNewPackage({data}:createNewPackageTypes):Promise<Pacotes>
    findPacote(pacoteId:number):Promise<Pacotes | null>
    findPacotes():Promise<Pacotes[] | null>

}