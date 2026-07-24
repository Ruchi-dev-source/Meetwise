import { getToolForIntent } from "./tool.registry";
import type { AuthenticatedUser } from "../../types/express";
import type { AssistantIntent, ConversationContext, ToolExecutionResult } from "./assistant.types";

/**
 * Executes exactly one tool for the detected intent. Every intent in
 * AssistantIntent has an entry in tool.registry.ts, so the "no tool
 * found" branch below shouldn't be reachable in practice — it exists as
 * a defensive fallback rather than a throw, so a routing gap degrades to
 * a graceful message instead of a 500.
 */
export async function executeTool(
  intent: AssistantIntent,
  message: string,
  user: AuthenticatedUser,
  context: ConversationContext
): Promise<ToolExecutionResult> {
  const tool = getToolForIntent(intent);
  if (!tool) {
    return { handled: false, message: "I don't have a way to help with that yet." };
  }
  return tool.execute({ message, user, context });
}
