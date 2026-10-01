import type { AssistantIntent, ConversationContext } from "./assistant.types";
import type { PendingSchedulingDraft } from "./scheduling.types";
import { PENDING_DRAFT_TTL_MS } from "./scheduling.constants";

export function createInitialContext(): ConversationContext {
  return {};
}

export function updateContext(
  context: ConversationContext,
  update: { prompt: string; intent: AssistantIntent; meetingId?: string; taskId?: string }
): ConversationContext {
  return {
    ...context,
    lastPrompt: update.prompt,
    lastIntent: update.intent,
    referencedMeetingId: update.meetingId ?? context.referencedMeetingId,
    referencedTaskId: update.taskId ?? context.referencedTaskId,
  };
}

// ── Pending scheduling drafts (Feature 11) ───────────────────────────────
// A single chat turn is one stateless HTTP request, so a genuinely
// multi-turn flow needs *something* to carry the in-progress request
// across two separate requests. In-memory map keyed by userId with a
// short TTL — not a durable store: nothing written to Postgres, nothing
// survives a process restart or scales across multiple server instances.

const pendingDrafts = new Map<string, PendingSchedulingDraft>();

export function getPendingSchedulingDraft(userId: string): PendingSchedulingDraft | undefined {
  const draft = pendingDrafts.get(userId);
  if (!draft) return undefined;
  if (Date.now() - draft.createdAt > PENDING_DRAFT_TTL_MS) {
    pendingDrafts.delete(userId);
    return undefined;
  }
  return draft;
}

export function setPendingSchedulingDraft(userId: string, draft: PendingSchedulingDraft): void {
  pendingDrafts.set(userId, draft);
}

export function clearPendingSchedulingDraft(userId: string): void {
  pendingDrafts.delete(userId);
}
