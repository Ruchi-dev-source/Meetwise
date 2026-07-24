import type { AssistantIntent, ConversationContext } from "./assistant.types";

/** A fresh, empty context for a single request. */
export function createInitialContext(): ConversationContext {
  return {};
}

/**
 * Returns a new context reflecting the latest turn. Referenced meeting/task
 * ids are only overwritten when a new one is supplied, so a later turn
 * that doesn't mention a meeting/task still "remembers" the last one
 * referenced within the same context object.
 */
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
