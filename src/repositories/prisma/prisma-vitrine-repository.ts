
import { VitrineRepository } from "../virine-repository";
import { prisma } from "@/lib/prisma";

export class PrismaPostsVirineRepository implements VitrineRepository {
    async findLike(usuarioId: number, postId: number) {
        return await prisma.like.findUnique({
          where: {
            usuarioId_postId: { usuarioId, postId },
          },
        });
      }
    
      async addLike(usuarioId: number, postId: number) {
        await prisma.like.create({
          data: { usuarioId, postId },
        });
      }
    
      async removeLike(usuarioId: number, postId: number) {
        await prisma.like.delete({
          where: {
            usuarioId_postId: { usuarioId, postId },
          },
        });
      }
    
      async addComment(usuarioId: number, postId: number, content: string) {
        return await prisma.comment.create({
          data: { usuarioId, postId, content },
        });
      }
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
   
    async FindManyPostsVitrine(userId:string) {
           // No seu controller do Node.js
const posts = await prisma.postsvitrine.findMany({
    include: {
      usuario: {
        select: {
          nome: true,
          image_path: true,
          role: true
        }
      },
      comments:true,
      _count: {
        select: {
          likes: true,
          comments: true
        }
      },
      // Opcional: Verificar se o usuário logado já curtiu este post
      likes: {
        where: { usuarioId: Number(userId) },
        take: 1
      }
    },
    orderBy: { created_at: 'desc' }
  });
  return posts
}
    
}