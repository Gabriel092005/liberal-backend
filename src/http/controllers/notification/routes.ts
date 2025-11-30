import { FastifyInstance } from "fastify";
import { markNotificationsAsSeenController } from "./markNotification";
import { verifyJWT } from "../middleware/verify-jwt";


export async function NotificacaoRoutes(app:FastifyInstance) {
    app.patch("/notifications/mark-as-seen",{onRequest:[verifyJWT]}, markNotificationsAsSeenController);
}