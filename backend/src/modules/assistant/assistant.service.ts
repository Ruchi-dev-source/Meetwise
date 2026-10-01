import { detectIntent } from "./intent.detector";
import { executeTool } from "./tool.executor";
import { createInitialContext, getPendingSchedulingDraft, updateContext } from "./conversation.service";
import type { AuthenticatedUser } from "../../types/express";
import type { AssistantChatInput, AssistantResponse } from "./assistant.types";

export async function chat(input: AssistantChatInput, user: AuthenticatedUser): Promise<AssistantResponse> {
  const context = createInitialContext();

  // Feature 5 step 2 / Feature 14: a confirmation turn is always about
  // completing a previously-offered scheduling recommendation — skip
  // intent detection (and its AI call) entirely.
  if (input.confirmation) {
    const result = await executeTool("SCHEDULE_MEETING", input.message, user, context, {
      confirmation: input.confirmation,
      selectedRecommendation: input.selectedRecommendation,
    });
    return { intent: "SCHEDULE_MEETING", confidence: 1, response: result.message, data: result.data };
  }

  // Feature 11: if this user already has an in-progress scheduling
  // request waiting on a follow-up answer, route straight back to the
  // scheduling tool rather than re-classifying intent. A bare reply
  // like "one hour" has no scheduling-flavored keywords of its own and
  // would otherwise misclassify as GENERAL_CHAT, abandoning the
  // conversation the user is actually still having.
  if (getPendingSchedulingDraft(user.id)) {
    const result = await executeTool("SCHEDULE_MEETING", input.message, user, context);
    updateContext(context, { prompt: input.message ?? "", intent: "SCHEDULE_MEETING" });
    return { intent: "SCHEDULE_MEETING", confidence: 1, response: result.message, data: result.data };
  }

  const { intent, confidence } = await detectIntent(input.message ?? "");
  const result = await executeTool(intent, input.message, user, context);

  updateContext(context, { prompt: input.message ?? "", intent });

  return { intent, confidence, response: result.message, data: result.data };
}
