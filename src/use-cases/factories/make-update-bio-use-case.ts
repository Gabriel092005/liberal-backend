import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { UpdateBioUseCase } from "../update-bio-use-case"

export function makeUpdateBioUseCase() {
  const usuariosRepository = new PrismaUserRepository()
  const updateBioUseCase = new UpdateBioUseCase(usuariosRepository)

  return updateBioUseCase
}
