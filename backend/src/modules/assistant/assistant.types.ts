import type { AuthenticatedUser } from "../../types/express";

// ── Feature 2: the fixed set of intents this phase understands ──────────

export type AssistantIntent =
  | "SCHEDULE_MEETING"
  | "SUMMARIZE_MEETING"
  | "CREATE_ACTION_ITEMS"
  | "ASK_ANALYTICS"
  | "ASK_TASKS"
  | "ASK_MEETINGS"
  | "RESCHEDULE_MEETING"
  | "CANCEL_MEETING"
  | "GENERAL_CHAT";

export const ASSISTANT_INTENTS: readonly AssistantIntent[] = [
  "SCHEDULE_MEETING",
  "SUMMARIZE_MEETING",
  "CREATE_ACTION_ITEMS",
  "ASK_ANALYTICS",
  "ASK_TASKS",
  "ASK_MEETINGS",
  "RESCHEDULE_MEETING",
  "CANCEL_MEETING",
  "GENERAL_CHAT",
];

export interface IntentDetectionResult {
  intent: AssistantIntent;
  confidence: number; // 0–1
}

// ── Feature 5: short-term, per-request conversation context ─────────────
// No database persistence yet — this shape exists so a future
// request-spanning store (session, cache, DB) can be dropped in without
// changing anything that reads/writes it today.

export interface ConversationContext {
  lastPrompt?: string;
  lastIntent?: AssistantIntent;
  referencedMeetingId?: string;
  referencedTaskId?: string;
}

// ── Tool contract (Feature 3/4/9) ────────────────────────────────────────
// Every tool — real or placeholder — implements this exact shape, so
// upgrading a placeholder to a real implementation later never requires
// touching the registry, executor, or controller.

export interface ToolExecutionInput {
  message: string;
  user: AuthenticatedUser;
  context: ConversationContext;
}

export interface ToolExecutionResult {
  handled: boolean; // false for the NOT_IMPLEMENTED placeholders in this phase
  message: string; // natural-language text for AssistantResponse.response
  data?: unknown; // whatever the underlying service call returns, once a tool is real
}

export interface AssistantTool {
  readonly name: string;
  readonly intents: readonly AssistantIntent[];
  execute(input: ToolExecutionInput): Promise<ToolExecutionResult>;
}

// ── HTTP-facing DTOs (Feature 1/7) ───────────────────────────────────────

export interface AssistantChatInput {
  message: string;
}

export interface AssistantResponse {
  intent: AssistantIntent;
  confidence: number;
  response: string;
  data?: unknown;
}
