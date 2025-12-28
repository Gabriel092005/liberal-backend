import { FastifyInstance } from "fastify";
import { Authenticate } from "./authenticate";
import { verifyJWT } from "../middleware/verify-jwt";
import { upload } from "@/utills/multer";
import { Register } from "./Register";
import { Profile } from "./Perfil";
import { FetchByProfission } from "./fetchByProfission";
import { FetchPrestadoresDestaques } from "./PrestadoresDestaques";
import { FetchPrestadores } from "./fetch-Prestadores";
import { UpdateProfile } from "./updateProfile";
import { updateProfileImage } from "./updateProfile-image";
import { getMonthlySalesController } from "./metrics-graphics";
import { LogOut } from "./log-out";
import { updateBioController } from "./update-bio-controller";
import { findCustomersController } from "./filteredCostumers";
import { Delete } from "./delete-users";
import { AtivarConta } from "./ativarconta";
import { SuspenderConta } from "./suspender-conta";
import { DesativarConta } from "./desativar-conta";
import { findPrestadoresController } from "./find-prestadores";
import { ProfileById } from "./get-user-byId";
import { Commentar } from "./commetar-prestadores";
import { GetComment } from "./get-comment";




export async function  UsersRoutes(app:FastifyInstance) {


app.post('/users', async function (request, reply) {
  await new Promise<void>((resolve, reject) => {
    upload.single('image')(request.raw as any, reply.raw as any, (err:any) => {
      if (err) return reject(err)
      resolve()
    })
  })

  const rawReq = request.raw as any
  request.body = rawReq.body
  console.log(rawReq.body)
  ;(request as any).file = rawReq.file

  console.log('File info:', (request as any).file)

  return Register(request, reply)
})


    app.post('/sessions',Authenticate)
    app.post("/ativarConta",{onRequest:[verifyJWT]}, AtivarConta)
    app.post("/desativarConta",{onRequest:[verifyJWT]},DesativarConta )
    app.post("/suspenderConta",{onRequest:[verifyJWT]},SuspenderConta)
    app.get('/ByProfission/:profissao',{onRequest:[verifyJWT]},FetchByProfission)
    app.post('/usuario/delete/:Id',Delete)
    app.get('/destaques',{onRequest:[verifyJWT]}, FetchPrestadoresDestaques)
    app.get('/prestadores/:query',{onRequest:[verifyJWT]}, FetchPrestadores)
    app.get('/me',{onRequest : [verifyJWT] } ,Profile)
    app.get('/profileById/:userId',ProfileById),
    app.get("/comment",GetComment)
    app.put('/update', { onRequest: [verifyJWT] },UpdateProfile),
    app.get("/admin/metrics/sales", getMonthlySalesController);
    app.get('/users/costumers/:province=province & nome=nome & municipality=municipality & page=page',findCustomersController)
    app.get('/users/prestadores/:province=province & nome=nome & municipality=municipality & page=page',findPrestadoresController)
    app.put("/usuario/bio", { onRequest: [verifyJWT] }, updateBioController)
    app.post("/log-out", LogOut);
    app.post("/commentar", Commentar)
    app.put('/update/profile-image', { onRequest: [verifyJWT]}, updateProfileImage)




    
}