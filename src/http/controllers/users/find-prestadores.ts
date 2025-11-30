import { makeFindCustomers } from "@/use-cases/factories/make-fetch-CostumersFiltered";
import { makeFindPrestadores } from "@/use-cases/factories/make-find-prestadores";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function findPrestadoresController(request: FastifyRequest, reply: FastifyReply) {
   const findAllCostumerQuerySchema = z.object(
   {
     province:z.string().optional(),
     nome:z.string().optional(),
     municipality:z.string().optional(),
     page:z.coerce.number()
   }
   )

   console.log(request.query)

    const { province, nome, municipality, page } = findAllCostumerQuerySchema.parse(request.query)

  const useCase = makeFindPrestadores();
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
