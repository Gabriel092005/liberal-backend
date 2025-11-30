import { usersRepository } from "@/repositories/users-repository";

export class FindCustomersUseCase {
  constructor(private customersRepository: usersRepository) {}

  async execute(province?: string, nome?: string, municipality?: string, page?: string) {
    const pageNumber = page ? Number(page) : 1;

    const result = await this.customersRepository.findAllCostumer(
      province,
      nome,
      municipality,
      pageNumber
    );

    return result;
  }
}
