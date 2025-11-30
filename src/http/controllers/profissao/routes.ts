import { FastifyInstance } from "fastify";
import { createNewProfission } from "./create-profission";
import { verifyJWT } from "../middleware/verify-jwt";
import { findProfission } from "./find-all-profission";
import { FetchProfissionByCategory } from "./fetch-byCategory";


export async function ProfissionRoutes(app:FastifyInstance){
  app.post("/create-profission",{onRequest:[verifyJWT]},createNewProfission)
  app.get("/get", findProfission)
  app.get("/byCategory/:categoryId",FetchProfissionByCategory)
    
}