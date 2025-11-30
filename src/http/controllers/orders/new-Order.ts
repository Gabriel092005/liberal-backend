
import { FastifyRequest, FastifyReply } from "fastify";
import { number, z } from "zod";
import { makeNewOrderUserCase } from "@/use-cases/factories/make-createOrders";

export async function createOrder(req: FastifyRequest, reply: FastifyReply) {
  const CreateNewOrderBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    brevidade: z.enum(['URGENTE', 'MEDIO', 'BAIXO']),
    location: z.string(),
    latitude:z.number().refine(value=>{
                return Math.abs(value)<=90
            }),
         longitude:z.number().refine(value=>{
                return Math.abs(value)<=180
            })
  });

  const authorId = req.user.sub;
  Number(authorId)
  const { title, content, brevidade, location, latitude, longitude } = CreateNewOrderBodySchema.parse(req.body);
  const image = (req as any).file;
  const image_path = image?.filename ?? null;

  const lttd= Number(latitude)
  const  lgtd = Number(longitude)
  Number(longitude)

  const { order } = await makeNewOrderUserCase().execute({
    authorId,
    brevidade,
    content,
    image_path,
    location,
    latitude:lttd,
    longitude:lgtd,
    title
  }); 
  // io.emit("server")

  return reply.status(201).send(order);
}
