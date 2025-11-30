// src/use-cases/find-my-notifications.ts

import { NotificationRepository } from "@/repositories/notificacao-repository";

interface FindMyNotificationsRequest {
  userId: number;
}

export class findMyNotificationsUseCase{
   constructor(private notificationRepository:NotificationRepository){}

   async execute({userId}:FindMyNotificationsRequest){
  const notifications = await this.notificationRepository.findMyNotifications(
    userId
  );

  return { notifications };
   }

}
