export interface Notification {
  id: string;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  userId: string;
}
