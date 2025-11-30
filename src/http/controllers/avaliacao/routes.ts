import { FastifyInstance } from "fastify";
import { Avaliar } from "./avaliar";
import { verifyJWT } from "../middleware/verify-jwt";


export async function AvaliacaoRoutes(app:FastifyInstance) {
     app.post("/avaliar",{onRequest:[verifyJWT]}, Avaliar)
}