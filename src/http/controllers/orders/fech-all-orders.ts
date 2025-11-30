import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchAllOrderUserCase } from "@/use-cases/factories/make-fetchAll-orders";
import { z } from "zod";

export async function FetchAllOrders(req: FastifyRequest, reply: FastifyReply) {
   const FetchAllOrdersRequestQuery = z.object({
    query:z.string().optional()
   })
   console.log(req.query)
   const {query} = FetchAllOrdersRequestQuery.parse(req.query)
   const {orders} =await makeFetchAllOrderUserCase().execute({
    query
   })
  return reply.status(200).send(orders);
}
