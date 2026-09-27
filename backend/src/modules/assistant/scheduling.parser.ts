import { aiService, parseJsonResponse } from "../ai";
import type { MeetingPriority, RecurrenceFrequency, RecurrenceRule, SchedulingIntent } from "./scheduling.types";

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const KNOWN_PRIORITIES: MeetingPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const SPELLED_OUT_NUMBERS: Record<string, number> = { half: 0.5, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

function emptyIntent(): SchedulingIntent {
  return {
    title: null,
    durationMinutes: null,
    participantNames: [],
    preferredDateText: null,
    preferredTimeText: null,
    timezone: null,
    description: null,
    priority: null,
    location: null,
    isRecurring: false,
    recurrenceRule: null,
  };
}

// NOTE: this parser handles both digit durations ("1 hour") AND
// spelled-out numbers ("one hour") — a prior draft of this file only
// matched "a/an hour", silently losing duration whenever a user wrote
// "one hour" instead. Verified with a dedicated unit test before this
// version was finalized.
export function parseDurationMinutes(text: string): number | null {
  const lower = text.toLowerCase();

  const hourMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)s?/);
  if (hourMatch) return Math.round(parseFloat(hourMatch[1]) * 60);

  const minMatch = lower.match(/(\d+)\s*(?:minute|min)s?/);
  if (minMatch) return parseInt(minMatch[1], 10);

  const spelledHourMatch = lower.match(/\b(half|one|two|three|four|five|six|a|an)\b\s*(?:an\s+)?hours?\b/);
  if (spelledHourMatch) {
    const word = spelledHourMatch[1];
    const multiplier = word === "a" || word === "an" ? 1 : SPELLED_OUT_NUMBERS[word];
    return Math.round(multiplier * 60);
  }

  const bareNumberMatch = lower.match(/^\s*(\d+)\s*$/);
  if (bareNumberMatch) return parseInt(bareNumberMatch[1], 10);

  return null;
}

export function parseRecurrence(text: string): { isRecurring: boolean; rule: RecurrenceRule | null } {
  const lower = text.toLowerCase();

  const weekdayMatch = WEEKDAYS.findIndex((day) => lower.includes(`every ${day}`));
  if (weekdayMatch >= 0) return { isRecurring: true, rule: { frequency: "WEEKLY", dayOfWeek: weekdayMatch } };
  if (/every\s*weekday|weekdays\b/.test(lower)) return { isRecurring: true, rule: { frequency: "WEEKDAYS" } };
  if (/\bdaily\b|every day/.test(lower)) return { isRecurring: true, rule: { frequency: "DAILY" } };
  if (/\bweekly\b|every week/.test(lower)) return { isRecurring: true, rule: { frequency: "WEEKLY" } };
  if (/\bmonthly\b|every month/.test(lower)) return { isRecurring: true, rule: { frequency: "MONTHLY" } };
  return { isRecurring: false, rule: null };
}

function extractParticipantNames(text: string): string[] {
  const withMatch = text.match(/\bwith\s+(.+?)(?:\s+for\s+\d|\s+at\s+\d|\s+on\s+\w|$)/i);
  if (!withMatch) return [];
  return withMatch[1]
    .split(/,|\band\b/i)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

function extractPriority(text: string): MeetingPriority | null {
  const upper = text.toUpperCase();
  return KNOWN_PRIORITIES.find((p) => upper.includes(p)) ?? null;
}

function extractHeuristically(message: string): SchedulingIntent {
  const intent = emptyIntent();
  const recurrence = parseRecurrence(message);
  intent.isRecurring = recurrence.isRecurring;
  intent.recurrenceRule = recurrence.rule;
  intent.durationMinutes = parseDurationMinutes(message);
  intent.participantNames = extractParticipantNames(message);
  intent.priority = extractPriority(message);

  const dateMatch = message.match(
    /\b(today|tomorrow|next week|next\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
  );
  if (dateMatch) intent.preferredDateText = dateMatch[1];

  const timeMatch = message.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i);
  if (timeMatch) intent.preferredTimeText = timeMatch[1];

  const titleMatch = message.match(
    /\b(?:schedule|set up|book|plan|arrange)\s+(?:a|an|the)?\s*(.+?)(?:\s+with\b|\s+for\s+\d|\s+at\s+\d|\s+on\s+\w|$)/i
  );
  if (titleMatch && titleMatch[1].trim().length > 0) intent.title = titleMatch[1].trim();

  return intent;
}

function buildExtractionPrompt(message: string): string {
  return [
    "Extract structured meeting-scheduling information from the user's message.",
    "Respond with ONLY a JSON object, no other text, in this exact shape:",
    JSON.stringify(
      {
        title: "string or null",
        durationMinutes: "number or null",
        participantNames: ["string", "..."],
        preferredDateText: "string or null",
        preferredTimeText: "string or null",
        timezone: "string or null",
        description: "string or null",
        priority: "one of LOW, MEDIUM, HIGH, CRITICAL, or null",
        location: "string or null",
        isRecurring: "boolean",
        recurrenceRule: { frequency: "DAILY | WEEKLY | MONTHLY | WEEKDAYS", dayOfWeek: "0-6 or omitted" },
      },
      null,
      2
    ),
    "Only include fields the user actually stated — never invent a value.",
    `User message: "${message.replace(/"/g, '\\"')}"`,
  ].join("\n");
}

function isValidExtraction(value: unknown): value is Partial<SchedulingIntent> {
  return typeof value === "object" && value !== null;
}

function isRecurrenceRule(value: unknown): value is RecurrenceRule {
  if (typeof value !== "object" || value === null) return false;
  const frequency = (value as { frequency?: unknown }).frequency;
  return typeof frequency === "string" && ["DAILY", "WEEKLY", "MONTHLY", "WEEKDAYS"].includes(frequency as RecurrenceFrequency);
}

export async function extractSchedulingIntent(message: string): Promise<SchedulingIntent> {
  const result = await aiService.generateText(buildExtractionPrompt(message), { maxRetries: 1 });
  if (!result.success) return extractHeuristically(message);

  try {
    const parsed = parseJsonResponse<Record<string, unknown>>(result.data);
    if (!isValidExtraction(parsed)) return extractHeuristically(message);

    const base = emptyIntent();
    return {
      title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : base.title,
      durationMinutes: typeof parsed.durationMinutes === "number" ? parsed.durationMinutes : parseDurationMinutes(message),
      participantNames: Array.isArray(parsed.participantNames)
        ? parsed.participantNames.filter((n): n is string => typeof n === "string" && n.trim().length > 0)
        : extractParticipantNames(message),
      preferredDateText: typeof parsed.preferredDateText === "string" ? parsed.preferredDateText : base.preferredDateText,
      preferredTimeText: typeof parsed.preferredTimeText === "string" ? parsed.preferredTimeText : base.preferredTimeText,
      timezone: typeof parsed.timezone === "string" ? parsed.timezone : base.timezone,
      description: typeof parsed.description === "string" ? parsed.description : base.description,
      priority: KNOWN_PRIORITIES.includes(parsed.priority as MeetingPriority) ? (parsed.priority as MeetingPriority) : extractPriority(message),
      location: typeof parsed.location === "string" ? parsed.location : base.location,
      isRecurring: typeof parsed.isRecurring === "boolean" ? parsed.isRecurring : parseRecurrence(message).isRecurring,
      recurrenceRule: isRecurrenceRule(parsed.recurrenceRule) ? parsed.recurrenceRule : parseRecurrence(message).rule,
    };
  } catch {
    return extractHeuristically(message);
  }
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function resolveDateText(text: string, now: Date): Date | null {
  const lower = text.toLowerCase().trim();
  if (lower === "today") return startOfDay(now);
  if (lower === "tomorrow") return addDays(startOfDay(now), 1);

  const nextMatch = lower.match(/^next\s+(\w+)$/);
  if (nextMatch) {
    if (nextMatch[1] === "week") return addDays(startOfDay(now), 7);
    const targetDay = WEEKDAYS.indexOf(nextMatch[1]);
    if (targetDay >= 0) {
      let diff = (targetDay - now.getDay() + 7) % 7;
      diff = (diff === 0 ? 7 : diff) + 7;
      return addDays(startOfDay(now), diff);
    }
  }

  const plainWeekday = WEEKDAYS.indexOf(lower);
  if (plainWeekday >= 0) {
    let diff = (plainWeekday - now.getDay() + 7) % 7;
    diff = diff === 0 ? 7 : diff;
    return addDays(startOfDay(now), diff);
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) return startOfDay(parsed);
  return null;
}

export function resolveTimeText(text: string): { hour: number; minute: number } | null {
  const match = text
    .toLowerCase()
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3];
  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return null;

  return { hour, minute };
}

export function combineDateAndTime(date: Date, time: { hour: number; minute: number } | null, defaultHour: number): Date {
  const combined = new Date(date);
  if (time) combined.setHours(time.hour, time.minute, 0, 0);
  else combined.setHours(defaultHour, 0, 0, 0);
  return combined;
}
