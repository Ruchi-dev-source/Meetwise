import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as notificationService from "./notification.service";
import { notificationIdParamSchema } from "./notification.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const notifications = await notificationService.listNotifications(user);
  return sendSuccess(res, 200, "Notifications retrieved", { notifications });
});

export const listUnreadNotifications = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const notifications = await notificationService.listUnreadNotifications(user);
  return sendSuccess(res, 200, "Unread notifications retrieved", { notifications });
});

export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { notificationId } = notificationIdParamSchema.parse(req.params);

  const notification = await notificationService.markNotificationAsRead(notificationId, user);
  return sendSuccess(res, 200, "Notification marked as read", { notification });
});

export const markAllNotificationsAsRead = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const result = await notificationService.markAllNotificationsAsRead(user);
  return sendSuccess(res, 200, "All notifications marked as read", result);
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { notificationId } = notificationIdParamSchema.parse(req.params);

  await notificationService.deleteNotification(notificationId, user);
  return res.status(204).send();
});
