import { calendarService } from "../calendar";
import { resolveParticipants } from "./participant.resolver";
import { rankRecommendations } from "./recommendation.ranker";
import { combineDateAndTime, extractSchedulingIntent, resolveDateText, resolveTimeText } from "./scheduling.parser";
import { clearPendingSchedulingDraft, getPendingSchedulingDraft, setPendingSchedulingDraft } from "./conversation.service";
import {
  ALLOW_WEEKENDS_BY_DEFAULT,
  DEFAULT_BUFFER_MINUTES,
  DEFAULT_TIMEZONE,
  LUNCH_BREAK_END,
  LUNCH_BREAK_START,
  SLOT_SEARCH_WINDOW_DAYS,
  WORKING_HOURS_END,
  WORKING_HOURS_START,
} from "./scheduling.constants";
import type { AssistantTool, ToolExecutionInput, ToolExecutionResult } from "./assistant.types";
import type { SchedulingRecommendation, SchedulingRequest, SchedulingResult } from "./scheduling.types";

function toResult(result: SchedulingResult): ToolExecutionResult {
  return { handled: true, message: result.message, data: result };
}

function formatSlotForHumans(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const dayLabel = start.toLocaleDateString("en-US", { weekday: "long" });
  const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dayLabel}, ${startTime} - ${endTime}`;
}

function formatRecommendations(recs: SchedulingRecommendation[]): string {
  const lines = recs.map((r) => `${r.rank}. ${formatSlotForHumans(r.start, r.end)} (${r.reason})`);
  return [`I found ${recs.length} possible meeting time${recs.length === 1 ? "" : "s"}.`, "", ...lines, "", "Reply with the option number to confirm."].join("\n");
}

async function handleConfirmation(input: ToolExecutionInput): Promise<ToolExecutionResult> {
  const draft = getPendingSchedulingDraft(input.user.id);
  if (!draft) {
    return toResult({ status: "NO_PENDING_REQUEST", message: "I don't have a pending meeting to confirm. Let's start over - what would you like to schedule?" });
  }

  const selected = draft.recommendations.find((r) => r.rank === input.selectedRecommendation);
  if (!selected) {
    return toResult({ status: "RECOMMENDATIONS", message: `That's not one of the options I offered. ${formatRecommendations(draft.recommendations)}`, recommendations: draft.recommendations });
  }

  // Feature 5 / closing instruction: only here, after explicit
  // confirmation, does the tool ever call CalendarService.scheduleMeeting
  // - and the AI never touches this call at all, since `selected` came
  // from a candidate slot CalendarService itself already proved was free.
  const scheduleResult = await calendarService.scheduleMeeting(
    {
      title: draft.request.title,
      description: draft.request.description,
      scheduledStart: new Date(selected.start),
      scheduledEnd: new Date(selected.end),
      participantIds: draft.request.participantIds,
    },
    input.user
  );

  clearPendingSchedulingDraft(input.user.id);

  if (scheduleResult.conflict) {
    return toResult({ status: "NO_AVAILABILITY", message: "Sorry - that slot was just taken by another meeting. Let's find a new time; what would you like to schedule?" });
  }

  return toResult({
    status: "SCHEDULED",
    message: `Done! "${draft.request.title}" is scheduled for ${formatSlotForHumans(selected.start, selected.end)}.${draft.request.isRecurring ? " (Note: recurrence was detected but isn't set up yet - this is a one-time meeting for now.)" : ""}`,
    meeting: scheduleResult.meeting,
    isRecurring: draft.request.isRecurring,
    recurrenceRule: draft.request.recurrenceRule,
  });
}

function parseDurationFromRequest(request: SchedulingRequest): number | null {
  return request.durationMinutes > 0 ? request.durationMinutes : null;
}

function buildMissingInfoPrompt(missingFields: string[]): string {
  if (missingFields.includes("title") && missingFields.length === 1) return "I can help schedule that. What should I call this meeting?";
  if (missingFields.includes("duration") && missingFields.length === 1) return "I can schedule that meeting. What duration would you like?";
  if (missingFields.includes("preferred date") && missingFields.length === 1) return "I can schedule that meeting. What day would you like it on?";
  return `I can help with that. Could you tell me the meeting's ${missingFields.join(" and ")}?`;
}

async function handleNewOrContinuedRequest(input: ToolExecutionInput): Promise<ToolExecutionResult> {
  const message = input.message ?? "";
  const existingDraft = getPendingSchedulingDraft(input.user.id);
  const extracted = await extractSchedulingIntent(message);

  const merged = {
    title: extracted.title ?? existingDraft?.request.title ?? null,
    durationMinutes: extracted.durationMinutes ?? (existingDraft ? parseDurationFromRequest(existingDraft.request) : null),
    participantNames: extracted.participantNames.length > 0 ? extracted.participantNames : existingDraft?.request.unresolvedParticipantNames ?? [],
    existingParticipantIds: existingDraft?.request.participantIds ?? [],
    preferredDateText: extracted.preferredDateText,
    preferredTimeText: extracted.preferredTimeText,
    timezone: extracted.timezone ?? existingDraft?.request.timezone ?? null,
    description: extracted.description ?? existingDraft?.request.description ?? undefined,
    priority: extracted.priority ?? existingDraft?.request.priority ?? "MEDIUM",
    location: extracted.location ?? existingDraft?.request.location ?? undefined,
    isRecurring: extracted.isRecurring || existingDraft?.request.isRecurring || false,
    recurrenceRule: extracted.recurrenceRule ?? existingDraft?.request.recurrenceRule ?? null,
    existingPreferredStart: existingDraft?.request.preferredStart ?? null,
  };

  const missingFields: string[] = [];
  if (!merged.title) missingFields.push("title");
  if (!merged.durationMinutes) missingFields.push("duration");
  const hasDateInfo = Boolean(merged.preferredDateText) || Boolean(merged.existingPreferredStart);
  if (!hasDateInfo) missingFields.push("preferred date");

  if (missingFields.length > 0) {
    setPendingSchedulingDraft(input.user.id, {
      request: {
        title: merged.title ?? "",
        durationMinutes: merged.durationMinutes ?? 0,
        participantIds: merged.existingParticipantIds,
        unresolvedParticipantNames: merged.participantNames,
        preferredStart: merged.existingPreferredStart,
        timezone: merged.timezone ?? DEFAULT_TIMEZONE,
        description: merged.description,
        priority: merged.priority as SchedulingRequest["priority"],
        location: merged.location,
        isRecurring: merged.isRecurring,
        recurrenceRule: merged.recurrenceRule,
      },
      recommendations: [],
      createdAt: Date.now(),
    });
    return toResult({ status: "NEEDS_INFO", message: buildMissingInfoPrompt(missingFields), missingFields });
  }

  const { resolvedIds, unresolvedNames } = await resolveParticipants(merged.participantNames, input.user.organizationId);
  const allParticipantIds = [...new Set([...merged.existingParticipantIds, ...resolvedIds])];

  if (unresolvedNames.length > 0) {
    setPendingSchedulingDraft(input.user.id, {
      request: {
        title: merged.title as string,
        durationMinutes: merged.durationMinutes as number,
        participantIds: allParticipantIds,
        unresolvedParticipantNames: unresolvedNames,
        preferredStart: merged.existingPreferredStart,
        timezone: merged.timezone ?? DEFAULT_TIMEZONE,
        description: merged.description,
        priority: merged.priority as SchedulingRequest["priority"],
        location: merged.location,
        isRecurring: merged.isRecurring,
        recurrenceRule: merged.recurrenceRule,
      },
      recommendations: [],
      createdAt: Date.now(),
    });
    return toResult({
      status: "UNRESOLVED_PARTICIPANTS",
      message: `I couldn't find these people in your organization: ${unresolvedNames.join(", ")}. Could you clarify who you mean, or drop them from the invite?`,
      unresolvedParticipants: unresolvedNames,
    });
  }

  const now = new Date();
  const preferredDate = merged.preferredDateText ? resolveDateText(merged.preferredDateText, now) : merged.existingPreferredStart ? new Date(merged.existingPreferredStart) : null;

  if (!preferredDate) {
    setPendingSchedulingDraft(input.user.id, {
      request: {
        title: merged.title as string,
        durationMinutes: merged.durationMinutes as number,
        participantIds: allParticipantIds,
        unresolvedParticipantNames: [],
        preferredStart: null,
        timezone: merged.timezone ?? DEFAULT_TIMEZONE,
        description: merged.description,
        priority: merged.priority as SchedulingRequest["priority"],
        location: merged.location,
        isRecurring: merged.isRecurring,
        recurrenceRule: merged.recurrenceRule,
      },
      recommendations: [],
      createdAt: Date.now(),
    });
    return toResult({ status: "NEEDS_INFO", message: "I can schedule that meeting. What day would you like it on?", missingFields: ["preferred date"] });
  }

  const time = merged.preferredTimeText ? resolveTimeText(merged.preferredTimeText) : null;
  const preferredStart = combineDateAndTime(preferredDate, time, WORKING_HOURS_START);
  const preferredEnd = new Date(preferredStart.getTime() + (merged.durationMinutes as number) * 60_000);

  const request: SchedulingRequest = {
    title: merged.title as string,
    durationMinutes: merged.durationMinutes as number,
    participantIds: allParticipantIds,
    unresolvedParticipantNames: [],
    preferredStart: preferredStart.toISOString(),
    timezone: merged.timezone ?? DEFAULT_TIMEZONE,
    description: merged.description,
    priority: merged.priority as SchedulingRequest["priority"],
    location: merged.location,
    isRecurring: merged.isRecurring,
    recurrenceRule: merged.recurrenceRule,
  };

  const availability = await calendarService.checkAvailability({ start: preferredStart, end: preferredEnd, participants: request.participantIds }, input.user);

  let recommendations: SchedulingRecommendation[];
  if (availability.available) {
    // Feature 5: even a conflict-free preferred slot is still offered as
    // a recommendation requiring confirmation - scheduling is always two-step.
    recommendations = [{ rank: 1, start: preferredStart.toISOString(), end: preferredEnd.toISOString(), reason: "Your preferred time - everyone is available", confidence: 0.95 }];
  } else {
    const searchStart = new Date(preferredStart);
    const searchEnd = new Date(preferredStart.getTime() + SLOT_SEARCH_WINDOW_DAYS * 24 * 60 * 60_000);

    const candidates = await calendarService.findAvailableSlots(input.user, request.participantIds, request.durationMinutes, searchStart, searchEnd, {
      workingHoursStart: WORKING_HOURS_START,
      workingHoursEnd: WORKING_HOURS_END,
      lunchStart: LUNCH_BREAK_START,
      lunchEnd: LUNCH_BREAK_END,
      bufferMinutes: DEFAULT_BUFFER_MINUTES,
      allowWeekends: ALLOW_WEEKENDS_BY_DEFAULT,
      maxResults: 10,
    });

    if (candidates.length === 0) {
      setPendingSchedulingDraft(input.user.id, { request, recommendations: [], createdAt: Date.now() });
      return toResult({ status: "NO_AVAILABILITY", message: `I couldn't find any open slot for everyone in the next ${SLOT_SEARCH_WINDOW_DAYS} days. Want to try a different duration or a smaller group?` });
    }

    recommendations = await rankRecommendations(candidates, request.title, true);
  }

  setPendingSchedulingDraft(input.user.id, { request, recommendations, createdAt: Date.now() });

  return toResult({ status: "RECOMMENDATIONS", message: formatRecommendations(recommendations), recommendations, isRecurring: request.isRecurring, recurrenceRule: request.recurrenceRule });
}

export const schedulingTool: AssistantTool = {
  name: "Calendar Tool",
  intents: ["SCHEDULE_MEETING"],
  async execute(input: ToolExecutionInput): Promise<ToolExecutionResult> {
    if (input.confirmation) return handleConfirmation(input);
    return handleNewOrContinuedRequest(input);
  },
};
