// ── Standardized call result (Feature 1 / 9) ────────────────────────────
// Every AIService method returns AIResult<T> — a discriminated union, so
// callers branch on `.success` instead of try/catching provider-specific
// exceptions. Nothing outside this module ever needs to know whether the
// underlying failure was an HTTP 429, a timeout, or a parse error — just
// one of these AIErrorCode values.

export type AIErrorCode =
  | "NOT_CONFIGURED"
  | "INVALID_API_KEY"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "PROVIDER_UNAVAILABLE"
  | "MALFORMED_RESPONSE"
  | "UNKNOWN";

export interface AITokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface AIResponse<T = string> {
  success: true;
  provider: string;
  model: string;
  data: T;
  latencyMs: number;
  tokenUsage?: AITokenUsage;
}

export interface AIError {
  success: false;
  code: AIErrorCode;
  message: string;
}

export type AIResult<T = string> = AIResponse<T> | AIError;

// ── Provider abstraction (Feature 10) ────────────────────────────────────
// AIService depends on this interface, never on a concrete provider
// class. gemini.service.ts is the only implementation today; adding
// OpenAI/Claude/Azure OpenAI later means writing a new module that
// implements the same shape and swapping one wiring point in
// ai.service.ts — nothing else in the codebase changes.

export interface AIProviderCallResult {
  text: string;
  model: string;
  tokenUsage?: AITokenUsage;
}

export interface AIProvider {
  readonly name: string;
  isConfigured(): boolean;
  generate(prompt: string): Promise<AIProviderCallResult>;
}

// ── Reusable feature-specific interfaces (Feature 8) ─────────────────────
// Placeholders for future features (summary, scheduling, action items,
// chat, dashboard insights) to return typed data through, once those
// features are actually built on top of this foundation. Not used by any
// endpoint in this phase.

export interface AISummary {
  summary: string;
  keyPoints: string[];
}

export interface AISchedulingSuggestion {
  suggestedStart: string;
  suggestedEnd: string;
  reason: string;
}

export interface AIActionItem {
  title: string;
  assigneeHint?: string;
  dueDateHint?: string;
}

export interface AIChatResponse {
  reply: string;
}

export interface AIInsight {
  title: string;
  description: string;
}

// ── Health status (Feature 6) ────────────────────────────────────────────

export interface AIHealthStatus {
  provider: string;
  configured: boolean;
  available: boolean;
}
