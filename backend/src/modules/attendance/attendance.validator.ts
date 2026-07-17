import { z } from "zod";

const uuid = (label: string) => z.string().uuid(`${label} must be a valid id`);

export const meetingIdParamSchema = z.object({
  meetingId: uuid("meetingId"),
});

export const attendanceParamsSchema = z.object({
  meetingId: uuid("meetingId"),
  userId: uuid("userId"),
});

const attendanceStatus = z.enum(["PRESENT", "ABSENT", "LATE"]);

export const markAttendanceSchema = z.object({
  status: attendanceStatus.optional(),
});
export type MarkAttendanceSchema = z.infer<typeof markAttendanceSchema>;

export const updateAttendanceSchema = z.object({
  status: attendanceStatus,
});
export type UpdateAttendanceSchema = z.infer<typeof updateAttendanceSchema>;
