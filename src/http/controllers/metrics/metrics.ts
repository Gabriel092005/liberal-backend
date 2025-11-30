import { makeMetrics } from "@/use-cases/factories/make-GetMetrics";
import { FastifyReply, FastifyRequest } from "fastify";



export async function metrics(req:FastifyRequest, reply:FastifyReply){
    try {
          const {
            clientesEmpresa,
            clientesIndividual,
            crescimento,
            pedidos,
            prestadoresEmpresa,
            prestadoresIndividual,
            receitas
          } =await makeMetrics().execute()
          return reply.status(200).send({receitas,clientesEmpresa,clientesIndividual,crescimento,pedidos,prestadoresEmpresa,prestadoresIndividual})
    } catch (error) {
        throw error
    }
    
}