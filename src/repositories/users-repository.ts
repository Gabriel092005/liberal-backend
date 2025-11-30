
import { Commentario, Prisma, Usuario }  from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
 interface usuarios {
    nome: string;
    celular: string;
    estrelas: number | null;
    profissao: string;
    municipio: string;
}[]
interface UsuarioDestaque {
  nome: string;
  estrelas: number | null;
  profissao: string;
  provincia: string;
  role: string;
  image_path?: string | null;
  municipio: string;
  celular: string;
}

// src/repositories/interfaces/filtered-users-costumer.ts
export interface FilteredUsersCostumer {
  data: Usuario[]; // ou substitui por Prisma.Usuario[] se estiver tipando diretamente
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}



export interface usersRepository {
    SuspenderConta(userId:number):Promise<null>
    findAdminProfile():Promise<Usuario | null>
    findComments():Promise<Commentario[]>
    findAllPrestadores (province?:string,municipality?:string, nome?:string,page?:number):Promise<FilteredUsersCostumer>
    DesativarConta(userId:number):Promise<null>
    AtivarConta(userId:number):Promise<null>
    findAllCostumer (province?:string,municipality?:string, nome?:string,page?:number):Promise<FilteredUsersCostumer>
    findById(id : number): Promise <Usuario | null> 
    FindPrestadoresDestaques():Promise<UsuarioDestaque[]>
    FindPrestadores(query:string|undefined):Promise<Usuario[]>
    updateStars(prestadorId: number, avgStars: number): Promise<Usuario>;
    findByNif(nif : string): Promise <Usuario | null> 
    FindByProfission(profissao:string):Promise<Usuario[]>
    findByPhone(phone:string):Promise<Usuario|null>
    delete(id:number):Promise<null>
    updateBio(userId:number, description:string):Promise<null>
    findAllClientes():Promise<Usuario[]>
    commentarPrestador(prestadorId:number, content:string):Promise<void>
    // findByEmail( email : string) : Promise <Usuario | null>  //devolvendo uma promise
    Create(data : Prisma.UsuarioCreateInput) : Promise<Usuario>
    update(
          nome:string|undefined,
          provincia:string|undefined, 
          municipio:string|undefined,
          celular:string|undefined,
          userId:number) : Promise<Usuario>

    fetchUsers():Promise<Usuario[]>
    totalPrestadoresIndividual():Promise<number>
    totalPrestadoresEmpresa():Promise<number>
    totalClientesEmpresa():Promise<number>
    totalClientesIndividual():Promise<number>
    totalReceitasObtidas():Promise<Decimal|null>
    totalReceitasPedidos():Promise<number>
    updateProfilePicture(image_path:string|undefined, userId:number):Promise<null>
}
