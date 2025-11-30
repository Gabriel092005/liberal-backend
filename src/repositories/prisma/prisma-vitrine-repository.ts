import { Postsvitrine, Prisma } from "@prisma/client";
import { VitrineRepository } from "../virine-repository";
import { prisma } from "@/lib/prisma";




export class PrismaPostsVirineRepository implements VitrineRepository{
   async delete(vitrineId: number){
    console.log("v", vitrineId)
       await prisma.postsvitrine.delete({
        where:{
            id:vitrineId
        }
       })

       return null
        
    }
   async FindManyAllPostsVitrine(){
                   const vitrine = await prisma.postsvitrine.findMany({
                    orderBy:{
                        created_at:'desc'
                    }
                   })
                    return vitrine
    
    }
    
async create(userId:string, description: string, title: string,image_path?: string,){
      if (!userId) {
      throw new Error("ID do usuário inválido ao criar post na vitrine.");
    }
         const  vitrine  = await prisma.postsvitrine.create({
            data:{
                titulo:title,
                usuarioId:Number(userId),
                description,
                image_path,
            }
         })
         return vitrine
    }
   
    async FindManyPostsVitrine(userId:string): Promise<Postsvitrine[]> {
         const vitrine = await prisma.postsvitrine.findMany({
            where:{
                usuarioId:Number(userId)
                
                
            },orderBy:{
                created_at:'desc'
            },
         })
         return vitrine
    }
    
}