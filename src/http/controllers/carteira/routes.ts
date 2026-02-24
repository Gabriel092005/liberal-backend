import { FastifyInstance } from "fastify";
import { GetCarteiraData } from "./get-carteira";
import { verifyJWT } from "../middleware/verify-jwt";
import { RecarregarCarteira } from "./recarregar-carteira";
import { getHistoricoRecargasController} from "./historico";
import { listarHistoricoPacotesController } from "./fetch-active-packages";
import { CriarPedidoPagamento } from "../payments/payments";
import { aprovarPagamento } from "../payments/approvar";


export async function CarteiraRoutes(app:FastifyInstance){
    app.get("/get-carteira",{onRequest:[verifyJWT]}, GetCarteiraData)
    app.get("/get-active-packages",{onRequest:[verifyJWT]}, listarHistoricoPacotesController)
    app.get("/historico/recargas/:carteiraId", getHistoricoRecargasController);
    app.post("/pagar",{onRequest:[verifyJWT]}, CriarPedidoPagamento)
    app.post("/approvar",{onRequest:[verifyJWT]}, aprovarPagamento)
} 