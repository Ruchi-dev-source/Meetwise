import type { MeetingStatus } from "@prisma/client";
import type { MeetingWithHost } from "../meetings/meeting.types";

export interface ScheduleMeetingInput {
  title: string;
  description?: string;
  tag?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  participantIds: string[];
}

export interface CheckAvailabilityInput {
  start: Date;
  end: Date;
  participants: string[];
}

export interface ConflictInfo {
  userId: string;
  name: string;
  meetingTitle: string;
  start: Date;
  end: Date;
}

/**
 * Discriminated on `conflict` rather than thrown as an ApiError — a
 * scheduling conflict isn't an exceptional/error condition in the usual
 * sense, and the spec requires a specific response shape
 * ({ success: false, message, conflicts }) that doesn't fit the generic
 * error envelope ({ success: false, message, errors }). Returning a
 * result the controller can branch on keeps that decision in the
 * controller (response shaping) rather than forcing the service to know
 * about HTTP status codes.
 */
export type ScheduleMeetingResult =
  | { conflict: false; meeting: MeetingWithHost }
  | { conflict: true; conflicts: ConflictInfo[] };

export type AvailabilityResult = { available: true } | { available: false; conflicts: ConflictInfo[] };

export type CalendarView = "day" | "week" | "month";

export interface CalendarMeetingSummary {
  id: string;
  title: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  status: MeetingStatus;
  hostId: string;
  hostName: string;
}

export interface CalendarDayGroup {
  date: string; // YYYY-MM-DD
  meetings: CalendarMeetingSummary[];
}

export interface CalendarViewResponse {
  view: CalendarView;
  rangeStart: Date;
  rangeEnd: Date;
  days: CalendarDayGroup[];
}

export interface ReminderSweepResult {
  meetingsProcessed: number;
  remindersCreated: number;
}
