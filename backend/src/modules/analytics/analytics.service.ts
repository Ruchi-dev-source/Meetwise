import type { AuthenticatedUser } from "../../types/express";
import * as analyticsRepository from "./analytics.repository";
import type { AttendanceStats, DashboardAnalytics, MeetingStats, TaskStats } from "./analytics.types";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfNextDay(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() + 1);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

/** Shapes a Prisma groupBy result (`[{ <key>: value, _count: { _all: n } }]`) into a plain Record. */
function groupByToRecord<K extends string>(
  groups: { _count: { _all: number } }[],
  key: string
): Record<string, number> {
  const record: Record<string, number> = {};
  for (const group of groups as Record<string, unknown>[]) {
    record[group[key] as K] = (group._count as { _all: number })._all;
  }
  return record;
}

function sumCounts(record: Record<string, number>): number {
  return Object.values(record).reduce((sum, n) => sum + n, 0);
}

export async function getMeetingStats(organizationId: string): Promise<MeetingStats> {
  const now = new Date();
  const [byStatusGroups, today, upcoming, thisMonth] = await Promise.all([
    analyticsRepository.groupMeetingsByStatus(organizationId),
    analyticsRepository.countMeetingsToday(organizationId, startOfDay(now), startOfNextDay(now)),
    analyticsRepository.countUpcomingMeetings(organizationId, now),
    analyticsRepository.countMeetingsThisMonth(organizationId, startOfMonth(now), startOfNextMonth(now)),
  ]);

  const byStatus = groupByToRecord(byStatusGroups, "status");

  return {
    total: sumCounts(byStatus),
    today,
    upcoming,
    completed: byStatus.COMPLETED ?? 0,
    thisMonth,
    byStatus,
  };
}

export async function getTaskStats(organizationId: string): Promise<TaskStats> {
  const [byStatusGroups, byPriorityGroups] = await Promise.all([
    analyticsRepository.groupTasksByStatus(organizationId),
    analyticsRepository.groupTasksByPriority(organizationId),
  ]);

  const byStatus = groupByToRecord(byStatusGroups, "status");
  const byPriority = groupByToRecord(byPriorityGroups, "priority");

  return {
    total: sumCounts(byStatus),
    pending: byStatus.TODO ?? 0,
    inProgress: byStatus.IN_PROGRESS ?? 0,
    completed: byStatus.COMPLETED ?? 0,
    byPriority,
    byStatus,
  };
}

export async function getAttendanceStats(organizationId: string): Promise<AttendanceStats> {
  const byStatusGroups = await analyticsRepository.groupAttendanceByStatus(organizationId);
  const byStatus = groupByToRecord(byStatusGroups, "status");

  const totalRecords = sumCounts(byStatus);
  const present = byStatus.PRESENT ?? 0;
  const absent = byStatus.ABSENT ?? 0;
  const late = byStatus.LATE ?? 0;

  return {
    totalRecords,
    present,
    absent,
    late,
    // Avoid divide-by-zero for a brand-new organization with no attendance
    // records yet — 0%, not NaN.
    attendancePercentage: totalRecords === 0 ? 0 : Math.round((present / totalRecords) * 100),
  };
}

export async function getDashboardAnalytics(user: AuthenticatedUser): Promise<DashboardAnalytics> {
  const { organizationId, id: userId } = user;

  const [meetingStats, taskStats, attendanceStats, notificationsUnread, filesUploaded, activeUsers] =
    await Promise.all([
      getMeetingStats(organizationId),
      getTaskStats(organizationId),
      getAttendanceStats(organizationId),
      analyticsRepository.countUnreadNotifications(userId),
      analyticsRepository.countFiles(organizationId),
      analyticsRepository.countUsers(organizationId),
    ]);

  return {
    totalMeetings: meetingStats.total,
    meetingsToday: meetingStats.today,
    upcomingMeetings: meetingStats.upcoming,
    completedMeetings: meetingStats.completed,
    meetingsThisMonth: meetingStats.thisMonth,
    meetingsByStatus: meetingStats.byStatus,

    totalTasks: taskStats.total,
    pendingTasks: taskStats.pending,
    inProgressTasks: taskStats.inProgress,
    completedTasks: taskStats.completed,
    tasksByPriority: taskStats.byPriority,
    tasksByStatus: taskStats.byStatus,

    attendancePercentage: attendanceStats.attendancePercentage,

    notificationsUnread,
    filesUploaded,
    activeUsers,
  };
}
