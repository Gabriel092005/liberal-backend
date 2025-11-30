import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { io } from "@/server";
import { UserAreadyExistsError } from "@/repositories/errors/user-already-exists-error";
import { makeRegisterUserCase } from "@/use-cases/factories/make-register-user";

export async function Register(request: FastifyRequest, reply: FastifyReply) {
  enum Role {
    ADMIN = "ADMIN",
    PRESTADOR_INDIVIDUAL = "PRESTADOR_INDIVIDUAL",
    CLIENTE_COLECTIVO = "CLIENTE_COLECTIVO",
    CLIENTE_INDIVIDUAL = "CLIENTE_INDIVIDUAL",
    PRESTADOR_COLECTIVO = "PRESTADOR_COLECTIVO", // caso uses este também
  }

  const RegisterBodySchema = z.object({
    nome: z.string(),
    celular: z.string(),
    nif: z.string(),
    palavraPasse: z.string(),
    profissao: z.string(),
    provincia: z.string(),
    municipio: z.string(),
    nomeRepresentante: z.string().optional(),
    email: z.string().email().optional(), // se for opcional
    phone: z.coerce.string().optional(),
    role: z.enum([
      Role.ADMIN,
      Role.CLIENTE_COLECTIVO,
      Role.CLIENTE_INDIVIDUAL,
      Role.PRESTADOR_INDIVIDUAL,
      Role.PRESTADOR_COLECTIVO,
    ]),
    image_path: z.string().nullable(), // adiciona aqui também
  });

  try {
    // arquivo enviado
    const image = (request as any).file
    const image_path = image?.filename ?? null;

    // corpo cru do form-data
    const rawBody = request.body as any;

    // cria um objeto unificado (igual ao que aparece no Insomnia)
    const bodyWithImage = {
      ...rawBody,
      image_path,
    };

    console.log("🧩 Corpo final recebido:", bodyWithImage);

    // valida com Zod
    const {
      nome,
      email,
      phone,
      celular,
      municipio,
      nif,
      profissao,
      provincia,
      role,
      palavraPasse,
      nomeRepresentante,
    } = RegisterBodySchema.parse(bodyWithImage);

    const registerUseCase = makeRegisterUserCase();

    const { user } = await registerUseCase.Execute({
      image_path,
      nome,
      celular,
      municipio,
      nif,
      nomeRepresentante,
      palavraPasse,
      profissao,
      provincia,
      Role: role,
    });

    // io.emit("users", user);

    return reply.status(201).send({ user });
  } catch (error) {
    if (error instanceof UserAreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    console.error("❌ Erro ao registrar usuário:", error);
    throw error;
  }
}
