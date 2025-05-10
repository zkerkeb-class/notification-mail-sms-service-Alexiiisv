import { Router, Request, Response } from "express";
import { Notification, CreateNotificationDto } from "../types/notification";

const router = Router();

// Store notifications in memory (in a real app, this would be a database)
let notifications: Notification[] = [];

// Get all notifications
router.get("/", (_req: Request, res: Response) => {
  res.json(notifications);
});

// Create a new notification
router.post(
  "/",
  (req: Request<{}, {}, CreateNotificationDto>, res: Response) => {
    const { title, message, userId } = req.body;

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
      read: false,
      createdAt: new Date(),
    };

    notifications.push(notification);
    res.status(201).json(notification);
  }
);

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
