import { usersRepository } from "@/repositories/users-repository";

export class GetCommentUseCase {
  constructor(
    private usersRepository: usersRepository
  ) {}

  async execute() {
      const Commentario = await this.usersRepository.findComments()
      return{
        Commentario
      }

    }
 


   
}
