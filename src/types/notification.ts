export interface Notification {
  id: string;
  title: string;
  message: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  read: boolean;
  createdAt: Date;
  emailSent?: boolean;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  sendEmail?: boolean;
}
