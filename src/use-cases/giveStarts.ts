import { AvaliacaoRepository } from "@/repositories/avaliar-prisma";
import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { usersRepository } from "@/repositories/users-repository";

interface GiveStarsRequest {
  clienteId: number;
  prestadorId: number;
  nota: number; // de 1 a 5
  comentario?: string;
}

export class GiveStarsUseCase {
  constructor(
    private avaliacaoRepository: AvaliacaoRepository,
    private usersRepository: usersRepository
  ) {}

  async execute({ clienteId, prestadorId, nota, comentario }: GiveStarsRequest): Promise<void> {
    // Verifica se o cliente existe
    const cliente = await this.usersRepository.findById(clienteId);
    if (!cliente) throw new resourceNotFoundError();

    // Verifica se o prestador existe
    const prestador = await this.usersRepository.findById(prestadorId);
    if (!prestador) throw new resourceNotFoundError();

    // Apenas clientes podem avaliar prestadores
    if (cliente.role === "PRESTADOR_INDIVIDUAL" || cliente.role === "PRESTADOR_COLECTIVO") {
      throw new Error("Apenas clientes podem avaliar prestadores");
    }

    // Verifica se o cliente já avaliou esse prestador
    const alreadyRated = await this.avaliacaoRepository.findByClienteAndPrestador(clienteId, prestadorId);
    if (alreadyRated) {
      throw new Error("Você já avaliou este prestador");
    }

    // Cria avaliação
    await this.avaliacaoRepository.create({
      clienteId,
      prestadorId,
      nota,
      comentario,
    });

    // Recalcula a média de estrelas do prestador
    const allRatings = await this.avaliacaoRepository.findAllByPrestador(prestadorId);
    const total = allRatings.reduce((sum:any, a:any) => sum + a.nota, 0);
    const avg = total / allRatings.length;

    // Atualiza estrelas do prestador
    await this.usersRepository.updateStars(prestadorId, avg);
  }
}
