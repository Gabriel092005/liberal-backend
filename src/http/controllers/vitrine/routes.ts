import { FastifyInstance } from "fastify";
import { PromoverPerfil } from "./promover-perfil";
import { verifyJWT } from "../middleware/verify-jwt";
import { FindManyPostsVitrineController } from "./fetch-my-vitrinePosts";
import { FindManyPostsVitrineaLLController } from "./fetch-all-vitrine-posts";
import { deleteVitrine } from "./delete";


export async function VitrineRoutes(app:FastifyInstance) {
    app.post("/vitrine",{onRequest:[verifyJWT]},PromoverPerfil)
    app.post("/delete-vitrine",deleteVitrine)
    app.get("/vitrine", { onRequest: [verifyJWT] }, FindManyPostsVitrineController);
    app.get("/vitrine-all",FindManyPostsVitrineaLLController);
    
}