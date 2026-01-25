import { InteresseRepository } from "../interessar-repository";
import { prisma } from "@/lib/prisma";

export class PrismaInteresseRepository implements InteresseRepository{
  
  concluirInteresse(prestadorId: number, orderId: number): Promise<number> {
    throw new Error("Method not implemented.");
  }
 async findByUserAndPedido(userId: number, pedidoId: number) {
  return await prisma.interesse.findFirst({
    where: {
      prestadorId:Number (userId),
      pedidoId: Number(pedidoId),
    },
  })
}
async findAllByPrestador(prestadorId: number) {
  const interesses = await prisma.interesse.findMany({
    where: { prestadorId},
    
    include: {
      pedido: {
        include: { // inclui todos os dados do pedido
          autor: { // e dentro do pedido, inclui apenas os campos do autor
            select: {
              id: true,
              nome: true,
              celular: true,
              provincia: true,
              municipio: true,
              image_path: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return interesses;
}

   async interessar(prestadorId: number, orderId: number){
    console.log("prestador:",prestadorId, "orderId:",orderId)
         const Interesse = await prisma.interesse.create({
            data:{
                prestadorId:Number(prestadorId),
                pedidoId:Number(orderId)
            }
         })
          return Interesse
    } 
    
}