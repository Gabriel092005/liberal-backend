import { Postsvitrine, Prisma } from "@prisma/client";

export interface VitrineRepository{
    create(title:string, description:string, userId:string,image_path:string|undefined, ):Promise<Postsvitrine>
    FindManyPostsVitrine(userId:string):Promise<Postsvitrine[] >
    delete(vitrineId:number):Promise<null>

    findLike(usuarioId: number, postId: number): Promise<any>;
  addLike(usuarioId: number, postId: number): Promise<void>;
  removeLike(usuarioId: number, postId: number): Promise<void>;
  addComment(usuarioId: number, postId: number, content: string): Promise<any>;
    FindManyAllPostsVitrine():Promise<Postsvitrine[] >
}