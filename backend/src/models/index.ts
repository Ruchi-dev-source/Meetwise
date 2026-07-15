// Prisma generates types directly from prisma/schema.prisma — there's no
// need to hand-write model interfaces. This file just re-exports them from
// a stable local path (./models) so controllers/services don't import
// @prisma/client directly all over the codebase.
export type {
  Organization,
  User,
  Meeting,
  Participant,
  Attendance,
  Task,
  Notification,
  ActivityLog,
  MeetingFile,
} from "@prisma/client";

export {
  Role,
  MeetingStatus,
  ParticipantRole,
  AttendanceStatus,
  TaskStatus,
  NotificationType,
} from "@prisma/client";
