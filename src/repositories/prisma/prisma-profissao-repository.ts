import { profissao } from "@prisma/client";
import { profissaoRepository } from "../profissao-repository";
import { prisma } from "@/lib/prisma";

export class PrismaProfissaoRepository implements profissaoRepository{
    async findProfissionByCategory(categoryId: number){
        const profissao = await prisma.profissao.findMany({
            where:{
                categoryId:categoryId
            }
        })
        return profissao

    }
    async create(title: string,categoryId:number) {
         const profissao = await prisma.profissao.create({
            data:{
                titulo:title,
                category:{
                    connect:{
                      id:categoryId
                    }
                }
            }
         })
         return profissao
    }
    async findProfissao() {
         const profissao = await prisma.profissao.findMany()
         return profissao
    }


}