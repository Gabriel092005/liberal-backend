
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { CommentarPrestadorUseCase } from '../commentarPrestadores';


export function  makeCommentarPrestadoresCase(){
    const usersRepository = new PrismaUserRepository()
    const UseCase = new CommentarPrestadorUseCase(usersRepository)
    return UseCase
}