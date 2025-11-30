import { FastifyRequest, FastifyReply } from "fastify";
import { makeMyOrderUserCase } from "@/use-cases/factories/make-FetchMyOrders";
import { z } from "zod";

export async function MyOrders(req: FastifyRequest, reply: FastifyReply) {
    const authorId = req.user.sub
    const searchQueryOrders = z.object({
       query:z.string().optional()
    })
    console.log(req.query)
    const {query} = searchQueryOrders.parse(req.query)
  if (!authorId) {
    return reply.status(400).send({ error: "." });
  }
  
   const {orders} = await makeMyOrderUserCase().execute({
    authorId,
    query
   })
  return reply.status(200).send(orders);
}
