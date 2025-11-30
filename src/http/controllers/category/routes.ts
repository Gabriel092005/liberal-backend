import { FastifyInstance } from "fastify";
import { createNewCategory } from "./create";
import { FindCategory } from "./find-category";
import { verifyJWT } from "../middleware/verify-jwt";
import { upload } from "@/utills/multer";
import { any } from "zod";

export async function categoryRoutes(app:FastifyInstance){
app.post('/create-category',{onRequest:[verifyJWT]}, async function (request, reply) {
    await new Promise<void>((resolve, reject) => {
        upload.single('image')(request.raw as any, reply.raw as any, (err) => {
            if (err) return reject(err)
                resolve()
        })
    })
    

  const rawReq = request.raw as any
  request.body = rawReq.body
  console.log(rawReq.body)
  ;(request as any).file = rawReq.file

  console.log('File info:', (request as any).file)

  return createNewCategory(request, reply)
})

    app.get("/fetch-category/:query=query",FindCategory)
}