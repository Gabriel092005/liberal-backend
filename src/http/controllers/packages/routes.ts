import { FastifyInstance } from "fastify";
import { CreateNewPackage } from "./create-new-package";
import { verifyJWT } from "../middleware/verify-jwt";
import { findAllPacotesController } from "./fetch-packages";


export async function packageRoutes(app:FastifyInstance){
    app.post("/newPackage",{onRequest:[verifyJWT]},CreateNewPackage)
    app.get("/pacotes",{onRequest:[verifyJWT]}, findAllPacotesController)
}