import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedUser } from "../../types/express";
import * as notificationRepository from "./notification.repository";

export function listNotifications(user: AuthenticatedUser) {
  return notificationRepository.listByUser(user.id);
}

export function listUnreadNotifications(user: AuthenticatedUser) {
  return notificationRepository.listUnreadByUser(user.id);
}

/**
 * A notification not owned by the caller — whether it belongs to someone
 * in a different organization entirely, or another user in the caller's
 * own organization — always 404s. Same "don't leak existence" pattern
 * used throughout this codebase (meetings/participants/attendance/tasks):
 * a user has no legitimate reason to know a notification id exists at
 * all unless it's theirs.
 */
async function getOwnedNotification(notificationId: string, user: AuthenticatedUser) {
  const notification = await notificationRepository.findById(notificationId);
  if (!notification || notification.userId !== user.id || notification.user.organizationId !== user.organizationId) {
    throw ApiError.notFound("Notification not found");
  }
  return notification;
}

export async function markNotificationAsRead(notificationId: string, user: AuthenticatedUser) {
  await getOwnedNotification(notificationId, user);
  return notificationRepository.markAsRead(notificationId);
}

export async function markAllNotificationsAsRead(user: AuthenticatedUser) {
  const result = await notificationRepository.markAllAsRead(user.id);
  return { updatedCount: result.count };
}

export async function deleteNotification(notificationId: string, user: AuthenticatedUser): Promise<void> {
  await getOwnedNotification(notificationId, user);
  await notificationRepository.deleteById(notificationId);
}
