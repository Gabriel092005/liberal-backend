import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { CriarPedidoPagamento } from "./payments";
import { aprovarPagamento } from "./approvar";
import { listarUltimasTransacoes } from "./get-transactions";



export async function Pagamentos(app:FastifyInstance){
    // app.post("/pagar",{onRequest:[verifyJWT]},CriarPedidoPagamento)
    app.post("/admin/approvar",{onRequest:[verifyJWT]}, aprovarPagamento)
    app.get('/transacoes/ultimas', listarUltimasTransacoes)
}