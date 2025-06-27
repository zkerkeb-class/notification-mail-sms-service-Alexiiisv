import { Router, Request, Response } from "express";
import { Notification, CreateNotificationDto } from "../types/notification";
import EmailService from "../services/email.service";

const router = Router();
const emailService = EmailService.getInstance();

// Store notifications in memory (in a real app, this would be a database)
let notifications: Notification[] = [];

// Get all notifications
router.get("/", (_req: Request, res: Response) => {
  res.json(notifications);
});

// Create a new notification
router.post(
  "/",
  async (req: Request<{}, {}, CreateNotificationDto>, res: Response) => {
    const { title, message, userId, userEmail, userName, sendEmail = false } = req.body;

    if (!title || !message || !userId) {
      return res
        .status(400)
        .json({ error: "Title, message and userId are required" });
    }

    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      userId,
      userEmail,
      userName,
      read: false,
      createdAt: new Date(),
      emailSent: false,
    };

    notifications.push(notification);

    // Send email if requested and email is provided
    if (sendEmail && userEmail) {
      try {
        const emailResult = await emailService.sendNotificationEmail(
          userEmail,
          title,
          message,
          userName
        );
        
        if (emailResult.success) {
          notification.emailSent = true;
          console.log(`Email sent successfully for notification ${notification.id}`);
        } else {
          console.error(`Failed to send email for notification ${notification.id}:`, emailResult.error);
        }
      } catch (error) {
        console.error(`Error sending email for notification ${notification.id}:`, error);
      }
    }

    res.status(201).json(notification);
  }
);

// Send email for existing notification
router.post("/:id/send-email", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  if (!notification.userEmail) {
    return res.status(400).json({ error: "No email address associated with this notification" });
  }

  try {
    const emailResult = await emailService.sendNotificationEmail(
      notification.userEmail,
      notification.title,
      notification.message,
      notification.userName
    );

    if (emailResult.success) {
      notification.emailSent = true;
      res.json({ 
        success: true, 
        message: "Email sent successfully",
        messageId: emailResult.messageId,
        notification 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: emailResult.error 
      });
    }
  } catch (error) {
    console.error(`Error sending email for notification ${id}:`, error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send email" 
    });
  }
});

// Mark a notification as read
router.patch("/:id/read", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  notification.read = true;
  res.json(notification);
});

// Get notifications for a specific user
router.get(
  "/user/:userId",
  (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    const userNotifications = notifications.filter((n) => n.userId === userId);
    res.json(userNotifications);
  }
);

export default router;
