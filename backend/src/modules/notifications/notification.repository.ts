import { prisma } from "../../lib/prisma";

// userId alone is sufficient scoping for all of these — a user belongs to
// exactly one organization, so "this user's notifications" and "this
// organization's notifications for this user" are the same set. The
// by-id operations still need an explicit organization check, done in
// notification.service.ts using the `user.organizationId` included below.

export function listByUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function listUnreadByUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: "desc" },
  });
}

export function findById(notificationId: string) {
  return prisma.notification.findUnique({
    where: { id: notificationId },
    include: { user: { select: { id: true, organizationId: true } } },
  });
}

export function markAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export function deleteById(notificationId: string) {
  return prisma.notification.delete({ where: { id: notificationId } });
}
