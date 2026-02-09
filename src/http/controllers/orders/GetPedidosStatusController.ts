import { GetPedidosStatusUseCase } from "@/use-cases/GetPedidosStatusUseCase";
import fastify, { FastifyReply, FastifyRequest } from "fastify";


export class GetPedidosStatusController {
  constructor(private getPedidosStatusUseCase: GetPedidosStatusUseCase) {}

  async handle(req: FastifyRequest, res: FastifyReply): Promise<Response> {
    try {
      const userId = req.user.sub ; // ou do token de autenticação

      const result = await this.getPedidosStatusUseCase.execute(Number(userId));
      
      return res.status(200).send(result);

    } catch (error:any) {
      console.error(error)
      return res.status(400).send(error);
    }
  }
}