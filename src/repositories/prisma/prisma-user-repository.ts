import {Prisma, Usuario } from "@prisma/client";
import { usersRepository } from "../users-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUserRepository implements usersRepository{
 async  FindNearPrestadores(latitude: number, longitude: number,profission:string){
const radiusKm = 10; // Raio de busca em quilómetros

const prestadoresProximos = await prisma.$queryRaw<
  (any & { distance: number })[]
>`
  SELECT 
    u.id,
    u.nome,
    u.fcm_token,
    u.celular,
    u.profissao,
    (
      6371 * acos(
        LEAST(1, GREATEST(
          cos(radians(${latitude})) *
          cos(radians(u.latitude)) *
          cos(radians(u.longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(u.latitude)),
        -1))
      )
    ) AS distance
  FROM "usuario" AS u
  WHERE u.latitude IS NOT NULL 
    AND u.longitude IS NOT NULL
    -- Filtra pelos dois tipos de prestadores no seu Enum
    AND u.role IN ('PRESTADOR_INDIVIDUAL', 'PRESTADOR_COLECTIVO')
    -- Filtra pela profissão exata do pedido (case-insensitive se necessário)
    AND u.profissao ILIKE ${profission}
    AND (
      6371 * acos(
        LEAST(1, GREATEST(
          cos(radians(${latitude})) *
          cos(radians(u.latitude)) *
          cos(radians(u.longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(u.latitude)),
        -1))
      )
    ) <= ${radiusKm}
  ORDER BY distance ASC;
`;
return prestadoresProximos
  }

  async findAdminProfile(){
      const Usuario = await prisma.usuario.findFirst({
        where:{
          role:'ADMIN'
        }
      })

      return Usuario 
  }
 async findComments(){
     const commentario  = await prisma.commentario.findMany({
      include:{ 
         prestador:{
          select:{
           nome:true,
           image_path:true,
           estrelas:true,
           id:true,
           municipio:true,
           provincia:true,
          }
         }
      },orderBy:{
        id:'desc'
      }
     })
     return commentario
  }
  async commentarPrestador(prestadorId: number, content: string){
      await prisma.commentario.create({
        data:{
          comentario:content,
          usuarioId:prestadorId
        }
      })
  }
  async findAllPrestadores(province?: string, municipality?: string, nome?: string,     page: number = 1){
        const perPage = 4;

const filters: Prisma.UsuarioWhereInput = {
  OR: [
    { role: "PRESTADOR_COLECTIVO" },
    { role: "PRESTADOR_INDIVIDUAL" },
  ],
  ...(province ? { provincia: { contains: province, mode: "insensitive" } } : {}),
  ...(municipality ? { municipio: { contains: municipality, mode: "insensitive" } } : {}),
  ...(nome ? { nome: { contains: nome, mode: "insensitive" } } : {}),
};


    const users = await prisma.usuario.findMany({
      where: filters,
      take: perPage,
      skip: (Number(page) - 1) * perPage,
      orderBy: { created_at: "desc" },
      include:{
        carteira:{
          select:{
            receita:true
          }
        }
      }
    },
  );

    const totalItems = await prisma.usuario.count({ where: filters });

    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: users,
      pagination: {
        currentPage: page,
        perPage,
        totalItems,
        totalPages,
      },
    };
  }
  async SuspenderConta(userId: number){
      await prisma.usuario.update({
        where:{
          id:userId
        },data:{
           estado_conta:'PENDENTE'
        }
      })
      return null
  }
  async DesativarConta(userId: number){
        await prisma.usuario.update({
        where:{
          id:userId
        },data:{
           estado_conta:'DESATIVADA'
        }
      })
      return null
  }
  async AtivarConta(userId: number){
       await prisma.usuario.update({
        where:{
          id:userId
        },data:{
           estado_conta:'ACTIVA'
        }
      })
      return null
  }
  async findAllCostumer(
    province?: string,
    nome?: string,
    municipality?: string,
    page: number = 1
  ){
    console.log("provincia:", province)
    console.log("muni:", municipality)
    console.log("nome:", nome)
    const perPage = 4;

const filters: Prisma.UsuarioWhereInput = {
  OR: [
    { role: "CLIENTE_INDIVIDUAL" },
    { role: "CLIENTE_COLECTIVO" },
  ],
  ...(province ? { provincia: { contains: province, mode: "insensitive" } } : {}),
  ...(municipality ? { municipio: { contains: municipality, mode: "insensitive" } } : {}),
  ...(nome ? { nome: { contains: nome, mode: "insensitive" } } : {}),
};


    const users = await prisma.usuario.findMany({
      where: filters,
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { created_at: "desc" },
    });

    const totalItems = await prisma.usuario.count({ where: filters });

    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: users,
      pagination: {
        currentPage: page,
        perPage,
        totalItems,
        totalPages,
      },
    };
  }
  async updateBio(userId: number, description:string){
     await prisma.usuario.update({
      where:{
        id:Number(userId),

      },
      data:{
        description
      }
     })
     return null
  }
  async findAllClientes(){
          const usuarios = await prisma.usuario.findMany({
            where:{
              role: {
                equals:"ADMIN"
              }
              }
          });
          return usuarios
  }
  async totalPrestadoresIndividual(){
       const count = await prisma.usuario.count({
        where:{
            role:'PRESTADOR_INDIVIDUAL'
        }
       });
       return count
  }
  async totalPrestadoresEmpresa() {
        const count = await prisma.usuario.count({
        where:{
            role:'PRESTADOR_COLECTIVO'
        }
       });
       return count
  }

  async totalClientesEmpresa(): Promise<number> {
    const count = await prisma.usuario.count({
        where:{
            role:'CLIENTE_COLECTIVO'
        }
       });
       return count
  }
  async totalClientesIndividual(){
         const count = await prisma.usuario.count({
        where:{
            role:'CLIENTE_INDIVIDUAL'
        }
       });
       return count
  }
  async totalReceitasObtidas(){
    const totalReceitas = await prisma.carteira.aggregate({
  _sum: {
    receita: true,
  },
})

return totalReceitas._sum.receita

  }
  async totalReceitasPedidos() {
       const count = await prisma.pedido.count();
       return count
  }
  async updateProfilePicture(image_path: string | undefined, userId:number){
          await prisma.usuario.update({
          where: { id: Number(userId)},
          data: {image_path : image_path},
    })

    return null
  }
 async update(
   celular: string|undefined,
   nome: string | undefined,
   provincia: string|undefined, 
   municipio: string|undefined, 
   userId: number){
    console.log("nome:", nome, "password:", "provincia:",provincia, "muni:",municipio, "celular:",celular)
      const usuario = await prisma.usuario.update({
        where:{
          id:Number(userId),
        },
        data:{
           nome:nome,
           celular:celular,
           provincia:provincia,
           municipio:municipio,
           
        }
      })
      return usuario
  }

   async updateStars(prestadorId: number, avgStars: number) {
    return await prisma.usuario.update({
      where: { id: prestadorId },
      data: { estrelas: avgStars },
    });
  }
 async FindPrestadores(query: string | undefined){
     const Usuarios = await prisma.usuario.findMany({
      where:{
         nome:{
           contains:query,
           mode:'insensitive'
         }
      }
     })

     return Usuarios
  }
async FindPrestadoresDestaques() {
  const usuarios = await prisma.usuario.findMany({
    where: {
      estrelas: {
        gte: 1,
      },
      
      role: {
        in: ['PRESTADOR_COLECTIVO', 'PRESTADOR_INDIVIDUAL'],
      },
    },
    select:{
         id:true,
         nome:true,
         estrelas:true,
         profissao:true,
         provincia:true,
         role:true,
         image_path:true,
         municipio:true,
         celular:true,
        //  links:true
       
    },
    orderBy: {
      estrelas: 'desc',
    },
  });

  return usuarios;
}


async FindByProfission(profissao: string): Promise<Usuario[]> {
 const usuarios = await prisma.usuario.findMany({
  where: {
    role: {
      in: ['PRESTADOR_COLECTIVO', 'PRESTADOR_INDIVIDUAL'],
    },
    OR: [
      {
        nome: {
          contains: profissao,
          mode: 'insensitive',
        },
      },
      {
        celular: {
          contains: profissao,
          mode: 'insensitive',
        },
      },
      {
        profissao: {
          contains: profissao,
          mode: 'insensitive',
        },
      },
    ],
  },
  orderBy: {
    nome: 'asc',
  },
})


  return usuarios
}


  async findByNif(nif: string){
       const usuario = await prisma.usuario.findFirst({
         where:{
           nif
         }
       })
       return usuario
  }
  async findByPhone(phone: string){
       const usuario = await prisma.usuario.findFirst({
          where:{
            celular:phone
          }
       })
       return usuario
  }
  
       async findById(id: number) {
 const usuario = await prisma.usuario.findUnique({
  where: { id: Number(id) },
  include: {
    _count: {
      select: {
        notificacoes: {
          where: { AlreadySeen: false }, // só conta notificações não lidas
        },
      },
    },
    notificacoes: {
      select: {
        content: true,
        id: true,
        AlreadySeen: true,
        created_at: true,
        authrId:true,
        image:true
      },
      orderBy: {
        created_at: "desc",
      },
      take: 8,
    },
  },
});


      return usuario

   }    
     async delete(id: number){
      await prisma.carteira.deleteMany({
  where: { usuarioId: id },
});

await prisma.usuario.delete({
  where: { id },
});
           
           return null
    }

  // async findByEmail(email: string) {
  //        const user = await prisma.usuario.findUnique({
  //           where: {
  //               email
  //           }
  //       })
  //      return user
  //   }
    
  async Create(data : Prisma.UsuarioCreateInput){
  const user = await prisma.usuario.create({
    data: {
      ...data,
      carteira: {
        create: {
          receita: 0,       // saldo inicial
          validade: null,   // opcional
        },
      },
    },
    include: {
      carteira: true, // retorna também a carteira criada
    },
  })

  return user
}


 async fetchUsers(){
         const users  = await prisma.usuario.findMany()
         return users
    }
      
}