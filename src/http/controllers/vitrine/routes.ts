import { FastifyInstance } from "fastify";
import { PromoverPerfil } from "./promover-perfil";
import { verifyJWT } from "../middleware/verify-jwt";
import { FindManyPostsVitrineController } from "./fetch-my-vitrinePosts";
import { FindManyPostsVitrineaLLController } from "./fetch-all-vitrine-posts";
import { deleteVitrine } from "./delete";
import { toggleLike } from "./reagirVitrine";
import { createComment } from "./commentarVitrine";


export async function VitrineRoutes(app:FastifyInstance) {
    app.post("/vitrine",{onRequest:[verifyJWT]},PromoverPerfil)
    app.post("/delete-vitrine",deleteVitrine)
    app.post("/vitrine/:postId/like", {onRequest:[verifyJWT]}, toggleLike);
    app.post("/vitrine/:postId/comment",{onRequest:[verifyJWT]} , createComment);
    app.get("/vitrine", { onRequest: [verifyJWT] }, FindManyPostsVitrineController);
    app.get("/vitrine-all",FindManyPostsVitrineaLLController);
    
}