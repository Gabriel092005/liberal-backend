import { NotificationRepository } from "@/repositories/notificacao-repository";

interface MarkAsSeenRequest {
  userId: number;
}

export class MarkNotificationsAsSeenUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({ userId }: MarkAsSeenRequest): Promise<void> {
    await this.notificationRepository.update(userId);
  }
}
