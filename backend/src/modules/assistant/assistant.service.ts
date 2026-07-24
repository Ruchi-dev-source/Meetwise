import { detectIntent } from "./intent.detector";
import { executeTool } from "./tool.executor";
import { createInitialContext, updateContext } from "./conversation.service";
import type { AuthenticatedUser } from "../../types/express";
import type { AssistantChatInput, AssistantResponse } from "./assistant.types";

export async function chat(input: AssistantChatInput, user: AuthenticatedUser): Promise<AssistantResponse> {
  const context = createInitialContext();

  // Detect intent once, execute exactly one tool for it (Feature 10).
  const { intent, confidence } = await detectIntent(input.message);
  const result = await executeTool(intent, input.message, user, context);

  // No cross-request persistence yet (Feature 5) — this still exercises
  // the update mechanics a future persisted store will reuse as-is.
  updateContext(context, { prompt: input.message, intent });

  return {
    intent,
    confidence,
    response: result.message,
    data: result.data,
  };
}
