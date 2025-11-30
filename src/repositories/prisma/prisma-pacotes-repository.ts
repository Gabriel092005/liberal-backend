import { Pacotes } from "@prisma/client";
import { createNewPackageTypes, pacotesRepository } from "../pacotes-repository";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";



export class PrismaPacotesRepository implements pacotesRepository{
  async  findPacotes(){
       const packages = await prisma.pacotes.findMany()
       return packages
    }
   async createNewPackage(data:createNewPackageTypes){
              const pacote = await prisma.pacotes.create(data)
              return pacote
;
    }
    async findPacote(pacoteId: number){
         const pacote = await prisma.pacotes.findUnique({ where: { id: pacoteId } });
         return pacote

    }
    

}