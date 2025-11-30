import { Category, Prisma, category } from "@prisma/client";
import { CategoryRepository } from "../category-repository";
import { prisma } from "@/lib/prisma";


export class PrismaCategoryRepository  implements CategoryRepository{
   async create(data: Prisma.categoryCreateInput){
       const category = await prisma.category.create({
        data
       })
       return category
    }
    async findManyCategories(query?: string) {
       if(query){
          const category = await prisma.category.findMany({
        where:{
            titulo:{
                contains:query,
                mode:'insensitive'
            },
        },orderBy:{
            created_at:'desc'
        }
       })
       return category
       }

           const category = await prisma.category.findMany({
        where:{
            titulo:{
                contains:query,
                mode:'insensitive'
            }
        },orderBy:{
            created_at:'desc'
        }
       })
       return category
    }
    async delete(categoryId: string){
       await prisma.category.delete({
        where:{
            id:Number(categoryId)
        }
       })
       return null
    }
    async updateCategory(title: string, categoryId:number){
        const category = await prisma.category.update({
            where:{
                id:categoryId
            },data:{
                titulo:title
            }
        })
        return category
    }
    async updateCategoryPhoto(image_path: string, categoryId:number){
        await prisma.category.update({
            where:{
                id:categoryId
            },
             data:{
                image_path
             }
        })
        return null
    }

}