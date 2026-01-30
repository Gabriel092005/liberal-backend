import { VitrineRepository } from "@/repositories/virine-repository";


interface CommentRequest {
  usuarioId: number;
  postId: number;
  content: string;
}

export class CommentUseCase {
  constructor(private repository: VitrineRepository) {}

  async execute({ usuarioId, postId, content }: CommentRequest) {
    const comment = await this.repository.addComment(usuarioId, postId, content);
    return comment;
  }
}