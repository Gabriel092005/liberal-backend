import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { createFavoritoController } from "./create-favoritos";
import { FetchFavoritosController } from "./fetch-favoritos";
import { removeFavoritoController } from "./remove";


export async function FavoritosRoutes(app:FastifyInstance){
    app.post("/favoritar",{onRequest:[verifyJWT]},createFavoritoController)
    app.get("/fetch/:search", {onRequest:[verifyJWT]}, FetchFavoritosController)
    app.delete("/remove/:prestadorId ", {onRequest:[verifyJWT]}, removeFavoritoController)
}