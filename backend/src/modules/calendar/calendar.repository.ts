import { prisma } from "../../lib/prisma";

const hostSelect = { select: { id: true, firstName: true, lastName: true } } as const;

const calendarMeetingSelect = {
  id: true,
  title: true,
  scheduledStart: true,
  scheduledEnd: true,
  status: true,
  hostId: true,
  host: hostSelect,
} as const;

/**
 * Meetings that overlap [start, end) and involve at least one of the given
 * users, either as host or as a participant — the two things "host
 * availability" and "participant availability" both reduce to. Cancelled
 * meetings don't block scheduling. Scoped to organizationId; participants
 * are filtered to just the ones we asked about, so the caller doesn't have
 * to guess which returned participant caused the conflict.
 */
export function findOverlappingMeetings(organizationId: string, start: Date, end: Date, userIds: string[]) {
  return prisma.meeting.findMany({
    where: {
      host: { organizationId },
      status: { not: "CANCELLED" },
      scheduledStart: { lt: end },
      scheduledEnd: { gt: start },
      OR: [{ hostId: { in: userIds } }, { participants: { some: { userId: { in: userIds } } } }],
    },
    select: {
      id: true,
      title: true,
      scheduledStart: true,
      scheduledEnd: true,
      hostId: true,
      host: hostSelect,
      participants: {
        where: { userId: { in: userIds } },
        select: { userId: true, user: { select: { firstName: true, lastName: true } } },
      },
    },
  });
}

/** Confirms every id in userIds is a real user belonging to organizationId, in one query. */
export function findUsersInOrganization(userIds: string[], organizationId: string) {
  return prisma.user.findMany({
    where: { id: { in: userIds }, organizationId },
    select: { id: true },
  });
}

export function getMeetingsForCalendar(organizationId: string, start: Date, end: Date) {
  return prisma.meeting.findMany({
    where: { host: { organizationId }, scheduledStart: { gte: start, lt: end } },
    select: calendarMeetingSelect,
    orderBy: { scheduledStart: "asc" },
  });
}

/** "My" meetings — hosted by or participated in by userId, per Feature 4/5's "for current user". */
export function getUpcomingMeetings(organizationId: string, userId: string, now: Date, limit: number) {
  return prisma.meeting.findMany({
    where: {
      host: { organizationId },
      scheduledStart: { gte: now },
      status: { in: ["SCHEDULED", "LIVE"] },
      OR: [{ hostId: userId }, { participants: { some: { userId } } }],
    },
    select: calendarMeetingSelect,
    orderBy: { scheduledStart: "asc" },
    take: limit,
  });
}

export function getTodaysMeetings(organizationId: string, userId: string, start: Date, end: Date) {
  return prisma.meeting.findMany({
    where: {
      host: { organizationId },
      scheduledStart: { gte: start, lt: end },
      OR: [{ hostId: userId }, { participants: { some: { userId } } }],
    },
    select: calendarMeetingSelect,
    orderBy: { scheduledStart: "asc" },
  });
}

/**
 * System-wide sweep for the reminder service (Feature 8) — deliberately
 * NOT organization-scoped, since this isn't a per-request user action; a
 * future cron job calls it once for the whole system, the same way any
 * batch job legitimately operates across tenants. It doesn't leak data
 * across organizations: each meeting's own participants (already
 * correctly org-scoped by construction) are the only people who receive
 * a notification about it.
 */
export function findMeetingsStartingSoon(start: Date, end: Date) {
  return prisma.meeting.findMany({
    where: { scheduledStart: { gte: start, lte: end }, status: { in: ["SCHEDULED", "LIVE"] } },
    select: {
      id: true,
      title: true,
      scheduledStart: true,
      hostId: true,
      participants: { select: { userId: true } },
    },
  });
}
