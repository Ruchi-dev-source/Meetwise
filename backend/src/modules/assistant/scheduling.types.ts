export type MeetingPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "WEEKDAYS";

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  dayOfWeek?: number;
}

export interface SchedulingIntent {
  title: string | null;
  durationMinutes: number | null;
  participantNames: string[];
  preferredDateText: string | null;
  preferredTimeText: string | null;
  timezone: string | null;
  description: string | null;
  priority: MeetingPriority | null;
  location: string | null;
  isRecurring: boolean;
  recurrenceRule: RecurrenceRule | null;
}

export interface SchedulingRequest {
  title: string;
  durationMinutes: number;
  participantIds: string[];
  unresolvedParticipantNames: string[];
  preferredStart: string | null;
  timezone: string;
  description?: string;
  priority: MeetingPriority;
  location?: string;
  isRecurring: boolean;
  recurrenceRule: RecurrenceRule | null;
}

export interface SchedulingRecommendation {
  rank: number;
  start: string;
  end: string;
  reason: string;
  confidence: number;
}

export interface SchedulingConfirmation {
  confirmation: true;
  selectedRecommendation: number;
}

export type SchedulingResultStatus =
  | "NEEDS_INFO"
  | "UNRESOLVED_PARTICIPANTS"
  | "RECOMMENDATIONS"
  | "SCHEDULED"
  | "NO_AVAILABILITY"
  | "NO_PENDING_REQUEST";

export interface SchedulingResult {
  status: SchedulingResultStatus;
  message: string;
  missingFields?: string[];
  unresolvedParticipants?: string[];
  recommendations?: SchedulingRecommendation[];
  meeting?: unknown;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule | null;
}

export interface PendingSchedulingDraft {
  request: SchedulingRequest;
  recommendations: SchedulingRecommendation[];
  createdAt: number;
}
