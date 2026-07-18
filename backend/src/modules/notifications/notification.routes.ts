import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as notificationController from "./notification.controller";

export const notificationRouter = Router();

notificationRouter.use(authenticate);

notificationRouter.get("/", notificationController.listNotifications);
notificationRouter.get("/unread", notificationController.listUnreadNotifications);
notificationRouter.patch("/read-all", notificationController.markAllNotificationsAsRead);
notificationRouter.patch("/:notificationId/read", notificationController.markNotificationAsRead);
notificationRouter.delete("/:notificationId", notificationController.deleteNotification);
