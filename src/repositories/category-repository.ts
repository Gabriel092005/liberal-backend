import { category, Prisma } from "@prisma/client";


export interface CategoryRepository {
     create(data:Prisma.categoryCreateInput):Promise<category>
     findManyCategories(query?:string):Promise<category[]>
     delete(categoryId:string):Promise<null>
     updateCategory(title:string, categoryId:number):Promise<category>
     updateCategoryPhoto(image_path:string, categoryId:number):Promise<null>
}