import { Postsvitrine, Prisma } from "@prisma/client";


export interface VitrineRepository{
    create(title:string, description:string, userId:string,image_path:string|undefined, ):Promise<Postsvitrine>
    FindManyPostsVitrine(userId:string):Promise<Postsvitrine[] >
    delete(vitrineId:number):Promise<null>
    FindManyAllPostsVitrine():Promise<Postsvitrine[] >
}