import { FastifyInstance } from "fastify";
import { metrics } from "./metrics";
import { verifyJWT } from "../middleware/verify-jwt";


export async function MetricsRoutes(app:FastifyInstance){
    app.get("/metrics",{onRequest:[verifyJWT]},metrics)
}