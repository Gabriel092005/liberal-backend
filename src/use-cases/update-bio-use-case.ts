// src/http/use-cases/usuario/update-bio-use-case.ts

import { usersRepository } from "@/repositories/users-repository"

interface UpdateBioUseCaseRequest {
  userId: number
  description: string
}

export class UpdateBioUseCase {
  constructor(private usuariosRepository: usersRepository) {}

  async execute({ userId, description }: UpdateBioUseCaseRequest) {
    if (!description || description.trim().length === 0) {
      throw new Error("A descrição não pode estar vazia.")
    }

    await this.usuariosRepository.updateBio(userId, description)
  }
}
