import { getToolForIntent } from "./tool.registry";
import type { AuthenticatedUser } from "../../types/express";
import type { AssistantIntent, ConversationContext, ToolExecutionResult } from "./assistant.types";

export async function executeTool(
  intent: AssistantIntent,
  message: string | undefined,
  user: AuthenticatedUser,
  context: ConversationContext,
  confirmation?: { confirmation: boolean; selectedRecommendation?: number }
): Promise<ToolExecutionResult> {
  const tool = getToolForIntent(intent);
  if (!tool) {
    return { handled: false, message: "I don't have a way to help with that yet." };
  }
  return tool.execute({
    message,
    user,
    context,
    confirmation: confirmation?.confirmation,
    selectedRecommendation: confirmation?.selectedRecommendation,
  });
}
