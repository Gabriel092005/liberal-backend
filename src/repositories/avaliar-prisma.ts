import { Avaliacao } from "@prisma/client";

export interface AvaliacaoRepository {
  /**
   * Verifica se um cliente já avaliou um prestador
   * @param clienteId ID do cliente
   * @param prestadorId ID do prestador
   * @returns Avaliacao existente ou null
   */
  findByClienteAndPrestador(
    clienteId: number,
    prestadorId: number
  ): Promise<Avaliacao | null>;

  /**
   * Cria uma nova avaliação
   */
  create(data: {
    clienteId: number;
    prestadorId: number;
    nota: number;
    comentario?: string;
  }): Promise<Avaliacao>;

  /**
   * Retorna todas avaliações de um prestador
   */
  findAllByPrestador(prestadorId: number): Promise<Avaliacao[]>;
}
