import type { Attendance, AttendanceStatus } from "@prisma/client";

/** An attendance record with just enough user info to render a roster — never the full User record. */
export type AttendanceWithUser = Attendance & {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export interface MarkAttendanceInput {
  status?: AttendanceStatus; // defaults to PRESENT — the caller is marking themselves as attending
}

export interface UpdateAttendanceInput {
  status: AttendanceStatus;
}
