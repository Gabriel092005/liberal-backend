import "@fastify/jwt"

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: number,
      carteiraId:number
      role :'ADMIN' |'PRESTADOR_INDIVIDUAL'|'CLIENTE_COLECTIVO'|'CLIENTE_INDIVIDUAL'
}   
    } 
  
}