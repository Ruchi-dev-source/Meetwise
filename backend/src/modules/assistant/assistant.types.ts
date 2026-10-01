import type { AuthenticatedUser } from "../../types/express";

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
  confidence: number;
}

export interface ConversationContext {
  lastPrompt?: string;
  lastIntent?: AssistantIntent;
  referencedMeetingId?: string;
  referencedTaskId?: string;
}

export interface ToolExecutionInput {
  message?: string;
  user: AuthenticatedUser;
  context: ConversationContext;
  confirmation?: boolean;
  selectedRecommendation?: number;
}

export interface ToolExecutionResult {
  handled: boolean;
  message: string;
  data?: unknown;
}

export interface AssistantTool {
  readonly name: string;
  readonly intents: readonly AssistantIntent[];
  execute(input: ToolExecutionInput): Promise<ToolExecutionResult>;
}

export interface AssistantChatInput {
  message?: string;
  confirmation?: boolean;
  selectedRecommendation?: number;
}

export interface AssistantResponse {
  intent: AssistantIntent;
  confidence: number;
  response: string;
  data?: unknown;
}
