import { PrismaNotificationRepository } from "@/repositories/prisma/prisma-notification-repository";
import { findMyNotificationsUseCase } from "../fetch-notifications";

export function makeFindMyNotificationsUseCase() {
  const notificationsRepository = new PrismaNotificationRepository();
  const useCase = new findMyNotificationsUseCase(notificationsRepository)
  return useCase
}