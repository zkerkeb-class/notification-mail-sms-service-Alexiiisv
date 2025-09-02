import express, { Express } from "express";
import cors from "cors";
import notificationRoutes from "./routes/notifications";

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notifications", notificationRoutes);

// Basic health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", service: "notification-service" });
});

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
