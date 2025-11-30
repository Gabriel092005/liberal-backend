import { PrismaNotificationRepository } from "@/repositories/prisma/prisma-notification-repository";
import { MarkNotificationsAsSeenUseCase } from "../upade-all-notif";


export function makeMarkNotificationsAsSeenUseCase() {
  const notificationRepository = new PrismaNotificationRepository();
  const useCase = new MarkNotificationsAsSeenUseCase(notificationRepository);

  return useCase;
}
