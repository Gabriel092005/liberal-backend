import { Prisma, Pedido } from "@prisma/client";
import { OrderRepository } from "../pedidos-repository";
import { prisma } from "@/lib/prisma";

export class PrismaOrderRepository implements OrderRepository {
  async findAllOrders(query:string|undefined){
      const orders = await prisma.pedido.findMany({
        where:{
           title:{
             contains:query,
            mode:'insensitive',
           },
         
           autor:{
              celular:{
                contains:query,
                mode:'insensitive'
              },
              nome:{
                contains:query,
                mode:'insensitive'
              },
              municipio:{
                contains:query,
                mode:'insensitive'
              }
              
           }
        }, 
        include:{
          autor:{
            select:{
              id:true,
              nome:true,
              image_path:true,
              municipio:true,
              provincia:true,
              celular:true,
              
            }
          }
        },orderBy:{
          created_at:'desc'
        }
      })
 
      return orders
  }
async RevokeOrder(prestadorId: number, pedidoId: number) {
const interessado = await prisma.interesse.findFirst({
    where: {
      pedidoId: Number(pedidoId),
      prestadorId: Number(prestadorId),
    },
  });

  if (!interessado) {
    throw new Error("Prestador não está vinculado a este pedido.");
  }
 console.log("pedidoId:", pedidoId)
  
  await prisma.pedido.update({
    where: { id: interessado.pedidoId},
    data: { status: "INTERRUPTED" },
  });

  await prisma.interesse.update({
    where: { id: interessado.id },
    data: { status: "PENDING" },
  });
  console.log("Seu pedido foi atualizado com sucesso!")

  return null

}
async findAnOrderInterested(pedidoId: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(pedidoId) },
    select: {
      interessados: true,
    },
  })
  return pedido?.interessados ?? []
}
  async AcceptedOrder(costumerId: number, orderId: number){
  return null
  }
  async findById(pedidoId: number) {
  const pedido = await prisma.pedido.findFirst({
    where: {
      id: Number(pedidoId)
    },
    include: {
      autor: {
        select: {
          nome: true,
          image_path: true,
          interesses: true
        }
      }
    }
  })
  return pedido
}

  async fecharPedido(prestadorId: number, pedidoId: number){
      const interessado = await prisma.interesse.findFirst({
    where: {
      pedidoId: Number(pedidoId),
      prestadorId: Number(prestadorId),
    },
  });

  if (!interessado) {
    throw new Error("Prestador não está vinculado a este pedido.");
  }
      await prisma.pedido.update({
    where: { id: interessado.pedidoId},
    data: { status: "ACEPTED" },
  });
  await prisma.interesse.update({
    where: { id: interessado.id },
    data: { status: "ACEPTED" },
  });
  console.log("Seu pedido foi atualizado com sucesso!")
       return null
  }
   async FindMyOrders(authorId:number, query:string|undefined){

const orders = await prisma.pedido.findMany({
  where: {
    usuarioId: Number(authorId),
    OR: [
      {
        title: {
          contains: query,
          mode: "insensitive", // pesquisa case-insensitive
        },
      },
      {
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
    ],
  },
  orderBy: { created_at: "desc" },
  include: {
    interessados: {
      where: {
        prestador: {
          role: { in: ["PRESTADOR_INDIVIDUAL", "PRESTADOR_COLECTIVO"] },
        },
      },
      include: {
        prestador: {
          select: {
            id: true,
            image_path: true,
            profissao: true,
            nome: true,
            celular: true,
            municipio: true,
            provincia: true,
            estrelas: true,
          },
        },
      },
    },
    _count: {
      select: { interessados: true },
    },
  },
});

        return orders
    }

  async delete(id: number) {
    
     await prisma.interesse.deleteMany({
    where: { pedidoId: Number(id) },
  })

    await prisma.pedido.delete({
      where: { id:Number(id) },
    });
    return null;
  }

  async Create(data: Prisma.PedidoCreateInput) {
    console.log(data)
    const order = await prisma.pedido.create({ data });
    return order;
  }
async fetchNearOrder(latitude: number, longitude: number, radiusKm = 5): Promise<(Pedido & { distance: number; dono: any })[]> {
  const orders = await prisma.$queryRaw<
    (Pedido & { distance: number; dono: any })[]
  >`
    SELECT 
      p.*,
      (
        6371 * acos(
          LEAST(1, GREATEST(
            cos(radians(${latitude})) *
            cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians(p.latitude)),
          -1))
        )
      ) AS distance,
      json_build_object(
        'id', u.id,
        'nome', u.nome,
        'provincia', u.provincia,
        'celular', u.celular
      ) AS dono
    FROM "pedidos" AS p
    JOIN "usuario" AS u ON u.id = p."usuarioId"
    WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
    AND (
      6371 * acos(
        LEAST(1, GREATEST(
          cos(radians(${latitude})) *
          cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(p.latitude)),
        -1))
      )
    ) <= ${radiusKm}
    ORDER BY distance ASC;
  `;

  return orders;
}



}
