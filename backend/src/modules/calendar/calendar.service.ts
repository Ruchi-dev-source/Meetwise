import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedUser } from "../../types/express";
import * as calendarRepository from "./calendar.repository";
import { meetingRepository } from "../meetings";
import { participantRepository } from "../participants";
import { notificationRepository } from "../notifications";
import type {
  AvailabilityResult,
  CalendarDayGroup,
  CalendarMeetingSummary,
  CalendarView,
  CalendarViewResponse,
  CheckAvailabilityInput,
  ConflictInfo,
  ReminderSweepResult,
  ScheduleMeetingInput,
  ScheduleMeetingResult,
} from "./calendar.types";

// ── Permissions (Feature 10: "Validate permissions" is a service concern —
// matching how every other module in this codebase does host/admin checks
// in the service layer rather than via generic role middleware) ─────────

function assertCanSchedule(user: AuthenticatedUser) {
  if (user.role !== "ADMIN" && user.role !== "HOST") {
    throw ApiError.forbidden("Only an organization admin or a host can schedule meetings");
  }
}

// ── Organization-membership check for a batch of participant ids ────────

async function assertParticipantsInOrganization(userIds: string[], organizationId: string) {
  if (userIds.length === 0) return;
  const found = await calendarRepository.findUsersInOrganization(userIds, organizationId);
  if (found.length !== new Set(userIds).size) {
    throw ApiError.badRequest("One or more participants don't belong to your organization");
  }
}

// ── Conflict detection (Feature 2) — shared by scheduleMeeting AND
// checkAvailability so the overlap logic exists in exactly one place ─────

async function findConflicts(
  organizationId: string,
  start: Date,
  end: Date,
  userIds: string[]
): Promise<ConflictInfo[]> {
  const overlapping = await calendarRepository.findOverlappingMeetings(organizationId, start, end, userIds);

  const conflicts: ConflictInfo[] = [];
  for (const meeting of overlapping) {
    if (userIds.includes(meeting.hostId)) {
      conflicts.push({
        userId: meeting.hostId,
        name: `${meeting.host.firstName} ${meeting.host.lastName}`,
        meetingTitle: meeting.title,
        start: meeting.scheduledStart,
        end: meeting.scheduledEnd,
      });
    }
    for (const participant of meeting.participants) {
      conflicts.push({
        userId: participant.userId,
        name: `${participant.user.firstName} ${participant.user.lastName}`,
        meetingTitle: meeting.title,
        start: meeting.scheduledStart,
        end: meeting.scheduledEnd,
      });
    }
  }
  return conflicts;
}

// ── Feature 1: Schedule Meeting ──────────────────────────────────────────

export async function scheduleMeeting(
  input: ScheduleMeetingInput,
  user: AuthenticatedUser
): Promise<ScheduleMeetingResult> {
  assertCanSchedule(user);
  await assertParticipantsInOrganization(input.participantIds, user.organizationId);

  const checkedUserIds = [user.id, ...input.participantIds];
  const conflicts = await findConflicts(user.organizationId, input.scheduledStart, input.scheduledEnd, checkedUserIds);
  if (conflicts.length > 0) {
    return { conflict: true, conflicts };
  }

  // Reuse the meetings module's own creation logic rather than duplicating
  // the insert here — hostId is always the authenticated user, never
  // client-supplied, matching how the meetings module itself works.
  const meeting = await meetingRepository.createMeeting(
    { title: input.title, description: input.description, tag: input.tag, scheduledStart: input.scheduledStart, scheduledEnd: input.scheduledEnd },
    user.id
  );

  // Reuse the participants module's own functions — the host-as-participant
  // upsert is the exact same idempotent helper the participants module
  // uses internally, and each invitee goes through the same createParticipant
  // insert that module's own invite endpoint calls.
  await Promise.all([
    participantRepository.upsertHostParticipant(meeting.id, user.id),
    ...input.participantIds.map((userId) => participantRepository.createParticipant(meeting.id, userId, "ATTENDEE")),
  ]);

  // Feature 7: notify host + every participant, reusing the notifications
  // module's own createMany (one INSERT, not a loop of single creates).
  const recipientIds = [user.id, ...input.participantIds];
  await notificationRepository.createMany(
    recipientIds.map((userId) => ({
      userId,
      type: "MEETING_INVITE" as const,
      title: "Meeting scheduled",
      message: `"${meeting.title}" is scheduled for ${meeting.scheduledStart.toISOString()}`,
      meetingId: meeting.id,
      senderId: user.id,
    }))
  );

  return { conflict: false, meeting };
}

// ── Feature 6: Check Availability ────────────────────────────────────────
// AI-ready by design (Feature 14): this returns the same ConflictInfo[]
// shape scheduleMeeting does, so a future Gemini-suggestion step can
// consume either endpoint's conflict list identically without a separate
// data shape to translate.

export async function checkAvailability(
  input: CheckAvailabilityInput,
  user: AuthenticatedUser
): Promise<AvailabilityResult> {
  await assertParticipantsInOrganization(input.participants, user.organizationId);

  const checkedUserIds = [user.id, ...input.participants];
  const conflicts = await findConflicts(user.organizationId, input.start, input.end, checkedUserIds);

  if (conflicts.length === 0) return { available: true };
  return { available: false, conflicts };
}

// ── Feature 3: Calendar View ──────────────────────────────────────────────

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/** Sunday-start week, per JS Date's own getDay() convention (0 = Sunday). */
function startOfWeek(date: Date): Date {
  return addDays(startOfDay(date), -date.getDay());
}

function computeRange(view: CalendarView, reference: Date, explicitEnd: Date | undefined): { start: Date; end: Date } {
  let start: Date;
  let defaultEnd: Date;

  switch (view) {
    case "day":
      start = startOfDay(reference);
      defaultEnd = addDays(start, 1);
      break;
    case "week":
      start = startOfWeek(reference);
      defaultEnd = addDays(start, 7);
      break;
    case "month":
    default:
      start = startOfMonth(reference);
      defaultEnd = addMonths(start, 1);
      break;
  }

  return { start, end: explicitEnd ?? defaultEnd };
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toSummary(meeting: {
  id: string;
  title: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  status: string;
  hostId: string;
  host: { firstName: string; lastName: string };
}): CalendarMeetingSummary {
  return {
    id: meeting.id,
    title: meeting.title,
    scheduledStart: meeting.scheduledStart,
    scheduledEnd: meeting.scheduledEnd,
    status: meeting.status as CalendarMeetingSummary["status"],
    hostId: meeting.hostId,
    hostName: `${meeting.host.firstName} ${meeting.host.lastName}`,
  };
}

export async function getCalendarView(
  view: CalendarView,
  startDate: Date | undefined,
  endDate: Date | undefined,
  user: AuthenticatedUser
): Promise<CalendarViewResponse> {
  const { start, end } = computeRange(view, startDate ?? new Date(), endDate);

  const meetings = await calendarRepository.getMeetingsForCalendar(user.organizationId, start, end);

  // Grouped by individual calendar day regardless of view — day is the
  // universal building block a React calendar component needs whether
  // it's currently rendering a day, week, or month grid.
  const byDay = new Map<string, CalendarMeetingSummary[]>();
  for (const meeting of meetings) {
    const key = toDateKey(meeting.scheduledStart);
    const bucket = byDay.get(key) ?? [];
    bucket.push(toSummary(meeting));
    byDay.set(key, bucket);
  }

  const days: CalendarDayGroup[] = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayMeetings]) => ({ date, meetings: dayMeetings }));

  return { view, rangeStart: start, rangeEnd: end, days };
}

// ── Feature 4: Upcoming Meetings ──────────────────────────────────────────

export async function getUpcomingMeetings(user: AuthenticatedUser, limit: number): Promise<CalendarMeetingSummary[]> {
  const meetings = await calendarRepository.getUpcomingMeetings(user.organizationId, user.id, new Date(), limit);
  return meetings.map(toSummary);
}

// ── Feature 5: Today's Meetings ───────────────────────────────────────────

export async function getTodaysMeetings(user: AuthenticatedUser): Promise<CalendarMeetingSummary[]> {
  const now = new Date();
  const meetings = await calendarRepository.getTodaysMeetings(
    user.organizationId,
    user.id,
    startOfDay(now),
    addDays(startOfDay(now), 1)
  );
  return meetings.map(toSummary);
}

// ── Feature 8: Reminder Service ───────────────────────────────────────────
// Not tied to any request/response — a future cron job calls this
// directly. See calendar.repository.findMeetingsStartingSoon for why this
// one function is intentionally not organization-scoped.

export async function sendUpcomingMeetingReminders(): Promise<ReminderSweepResult> {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + 30 * 60 * 1000);

  const meetings = await calendarRepository.findMeetingsStartingSoon(now, windowEnd);

  const perMeetingCounts = await Promise.all(
    meetings.map(async (meeting: { id: string; title: string; scheduledStart: Date; hostId: string; participants: { userId: string }[] }) => {
      const recipientIds = [...new Set([meeting.hostId, ...meeting.participants.map((p: { userId: string }) => p.userId)])];
      const result = await notificationRepository.createMany(
        recipientIds.map((userId) => ({
          userId,
          type: "MEETING_REMINDER" as const,
          title: "Meeting starting soon",
          message: `"${meeting.title}" starts at ${meeting.scheduledStart.toISOString()}`,
          meetingId: meeting.id,
        }))
      );
      return result.count;
    })
  );

  return {
    meetingsProcessed: meetings.length,
    remindersCreated: perMeetingCounts.reduce((sum, n) => sum + n, 0),
  };
}
