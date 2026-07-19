import { prisma } from "../../lib/prisma";

// ── Meetings ──────────────────────────────────────────────────────────
// Scoped via the host relation (Meeting has no organizationId column of
// its own — same transitive-scoping pattern already used by the
// meetings/participants/attendance/tasks/files modules).

export function groupMeetingsByStatus(organizationId: string) {
  return prisma.meeting.groupBy({
    by: ["status"],
    where: { host: { organizationId } },
    _count: { _all: true },
  });
}

export function countMeetingsToday(organizationId: string, start: Date, end: Date) {
  return prisma.meeting.count({
    where: { host: { organizationId }, scheduledStart: { gte: start, lt: end } },
  });
}

export function countUpcomingMeetings(organizationId: string, now: Date) {
  return prisma.meeting.count({
    where: {
      host: { organizationId },
      scheduledStart: { gte: now },
      status: { in: ["SCHEDULED", "LIVE"] },
    },
  });
}

export function countMeetingsThisMonth(organizationId: string, start: Date, end: Date) {
  return prisma.meeting.count({
    where: { host: { organizationId }, scheduledStart: { gte: start, lt: end } },
  });
}

// ── Tasks ─────────────────────────────────────────────────────────────
// Scoped via the assignee relation, not meetingId — meetingId is
// nullable (a task can exist without a meeting), so assigneeId (always
// required, always a member of exactly one organization) is the
// reliable scoping key.

export function groupTasksByStatus(organizationId: string) {
  return prisma.task.groupBy({
    by: ["status"],
    where: { assignee: { organizationId } },
    _count: { _all: true },
  });
}

export function groupTasksByPriority(organizationId: string) {
  return prisma.task.groupBy({
    by: ["priority"],
    where: { assignee: { organizationId } },
    _count: { _all: true },
  });
}

// ── Attendance ────────────────────────────────────────────────────────
// Scoped via meeting.host — attendance is meeting-centric (attendance
// percentage is "how present were people across this org's meetings").

export function groupAttendanceByStatus(organizationId: string) {
  return prisma.attendance.groupBy({
    by: ["status"],
    where: { meeting: { host: { organizationId } } },
    _count: { _all: true },
  });
}

// ── Notifications ─────────────────────────────────────────────────────
// Scoped by userId, not organizationId — notifications are strictly
// per-user by design (see the notifications module: "users may only
// access their own"), so the dashboard's unread count is the calling
// user's own unread count, not an organization-wide figure.

export function countUnreadNotifications(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}

// ── Files ─────────────────────────────────────────────────────────────

export function countFiles(organizationId: string) {
  return prisma.meetingFile.count({
    where: { meeting: { host: { organizationId } } },
  });
}

// ── Users ─────────────────────────────────────────────────────────────

export function countUsers(organizationId: string) {
  return prisma.user.count({ where: { organizationId } });
}
