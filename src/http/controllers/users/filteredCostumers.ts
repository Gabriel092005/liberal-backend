import { makeFindCustomers } from "@/use-cases/factories/make-fetch-CostumersFiltered";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function findCustomersController(request: FastifyRequest, reply: FastifyReply) {
   const findAllCostumerQuerySchema = z.object(
   {
     province:z.string().optional(),
     nome:z.string().optional(),
     municipality:z.string().optional(),
     page:z.coerce.number()
   }
   )

    const { province, nome, municipality, page } = findAllCostumerQuerySchema.parse(request.query)

  const useCase = makeFindCustomers();
  const result = await useCase.execute(province, nome, municipality, String(page));

  return reply.status(200).send({
    success: true,
    users: result.data,
    pagination: {
      perPage:result.pagination.perPage,
      currentPage:result.pagination.currentPage,
      total: result.pagination.totalItems,
      totalPages: result.pagination.totalPages,
    },
  });
}
