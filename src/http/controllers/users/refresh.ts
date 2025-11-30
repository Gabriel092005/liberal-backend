// import { FastifyRequest,FastifyReply } from "fastify";  
// export async function refresh(request:FastifyRequest,reply:FastifyReply) {

//     await request.jwtVerify({onlyCookie : true})

//     const {role} =request.user
    
//     const token = reply.jwtSign(
//       {role},
//        {
//          sign:{
//             sub:request.user.sub
//          },     
//       })
//    const refreshToken = await .jwtSign(
//     {role},
//       {
//          sign:{
//             sub:request.user.sub    ,
//             expiresIn:'7d',
//          }
//       }
//    )
//       return reply
//       .setCookie('refreshToken',refreshToken,{
//          path : '/',
//          secure:true,
//          httpOnly:true
//      })
//       .status(200)
//       .send({token})   
// }