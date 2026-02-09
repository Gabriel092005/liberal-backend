import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fetchNearOrderController } from "./NearOrders";
import { createOrder } from "./new-Order";
import { verifyJWT } from "../middleware/verify-jwt";
import { MyOrders } from "./fetchmyOrders";
import { FecharPedido } from "./fecharPedido";
import { RevokeOrder } from "./revokeOrders";
import { ImterromperPedido } from "./interromper-pedido";
import { FetchAllOrders } from "./fech-all-orders";
import { concluirPedidoController } from "./concluirPedido";
import { makeGetPedidosStatusController } from "@/use-cases/factories/makeGetPedidosStatus";


export async function OrderRoutes(app:FastifyInstance) {
   const getPedidosStatusController = makeGetPedidosStatusController();
   app.get("/orders/:latitude & longitude & radiusKm", {onRequest:[verifyJWT]},fetchNearOrderController)  
   app.put("/interromper", {onRequest:[verifyJWT]},ImterromperPedido)
   app.get(
      "/pedidos/status", 
      { onRequest: [verifyJWT] }, 
      (request:FastifyRequest, reply:FastifyReply) => getPedidosStatusController.handle(request, reply)
    );
   app.get("/all-orders/:query",{onRequest:[verifyJWT]}, FetchAllOrders)
   app.post("/order", {onRequest:[verifyJWT]}, createOrder)  
   app.patch("/pedidos/concluir", { onRequest: [verifyJWT] }, concluirPedidoController);
   app.delete("/revoke/:pedidoId?",{onRequest:[verifyJWT]}, RevokeOrder)
   app.put("/fechar", {onRequest:[verifyJWT]}, FecharPedido)  
   app.get("/MyOrders/:query?", {onRequest:[verifyJWT]}, MyOrders)  
} 