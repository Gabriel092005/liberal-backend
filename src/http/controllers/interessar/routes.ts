import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { Interessar } from "./interessar";
import { InteresseOrdersController } from "./interested-orders";




export async function InteresseRoutes(app:FastifyInstance) {
    app.post('/interesse',{onRequest:[verifyJWT]},Interessar)
    app.get("/interrested-orders",{onRequest:[verifyJWT]}, InteresseOrdersController)
}