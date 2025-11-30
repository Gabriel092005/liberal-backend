import { FastifyRequest, FastifyReply } from "fastify";
import { FetchNearOrderUseCase } from "@/use-cases/FetchNearOrders";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-pedidos-repository";
import { z } from "zod";


export async function fetchNearOrderController(req: FastifyRequest, reply: FastifyReply) {

  console.log(req.query)
  
    const FetchNearOrdersQuery = z.object({
         latitude:z.coerce.number(),
         longitude:z.coerce.number(),
         radiusKm:z.coerce.number()
    })

    const {latitude,longitude,radiusKm} = FetchNearOrdersQuery.parse(req.query)


  if (!latitude || !longitude) {
    return reply.status(400).send({ error: "Latitude e longitude são obrigatórias." });
  }

  const orderRepository = new PrismaOrderRepository();
  const useCase = new FetchNearOrderUseCase(orderRepository);

  const orders = await useCase.execute({
    latitude: Number(latitude),
    longitude: Number(longitude),
    radiusKm: radiusKm ? Number(radiusKm) : 5,
  });

  return reply.status(200).send(orders);
}
