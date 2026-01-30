import { VitrineRepository } from "@/repositories/virine-repository";

export class ToggleLikeUseCase {
  constructor(private vitrineRepository: VitrineRepository) {}

  async execute(usuarioId: number, postId: number) {
    // 1. Verifica se o usuário já curtiu
    const existingLike = await this.vitrineRepository.findLike(usuarioId, postId);

    if (existingLike) {
      // 2. Se existe, remove (Unlike)
      await this.vitrineRepository.removeLike(usuarioId, postId);
      return { liked: false };
    }

    // 3. Se não existe, adiciona (Like)
    await this.vitrineRepository.addLike(usuarioId, postId);
    return { liked: true };
  }
}