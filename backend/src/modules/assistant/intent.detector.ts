import { aiService, parseJsonResponse } from "../ai";
import { ASSISTANT_INTENTS } from "./assistant.types";
import type { AssistantIntent, IntentDetectionResult } from "./assistant.types";

function buildIntentPrompt(message: string): string {
  return [
    "Classify the user's message into exactly one of these intents:",
    ASSISTANT_INTENTS.join(", "),
    "Respond with ONLY a JSON object, no other text, in this exact shape:",
    '{"intent": "<ONE_OF_THE_INTENTS_ABOVE>", "confidence": <number between 0 and 1>}',
    `User message: "${message.replace(/"/g, '\\"')}"`,
  ].join("\n");
}

function isKnownIntent(value: unknown): value is AssistantIntent {
  return typeof value === "string" && (ASSISTANT_INTENTS as readonly string[]).includes(value);
}

function clampConfidence(value: unknown): number {
  return typeof value === "number" && !Number.isNaN(value) ? Math.min(Math.max(value, 0), 1) : 0.5;
}

/**
 * Simple keyword fallback, used only when the AI provider call itself
 * fails (not configured, timeout, rate limited, etc.) — deliberately
 * lower-confidence than an AI classification, since it's a much cruder
 * signal. This keeps `/assistant/chat` usable in any environment that
 * hasn't turned AI on, rather than the whole endpoint failing whenever
 * Gemini is unavailable.
 */
function detectIntentHeuristically(message: string): IntentDetectionResult {
  const text = message.toLowerCase();
  const rules: [RegExp, AssistantIntent][] = [
    [/\breschedul/, "RESCHEDULE_MEETING"],
    [/\bcancel/, "CANCEL_MEETING"],
    [/\bschedule|\bset up a meeting|\bbook a meeting|\bplan a meeting/, "SCHEDULE_MEETING"],
    [/\bsummar/, "SUMMARIZE_MEETING"],
    [/\baction item|\bassign.*task|\bcreate.*task/, "CREATE_ACTION_ITEMS"],
    [/\banalytic|\bdashboard|\bstatistic/, "ASK_ANALYTICS"],
    [/\bmy tasks|\btasks assigned|\bpending task/, "ASK_TASKS"],
    [/\bmeetings? (today|upcoming|this week)|\bwhat meetings/, "ASK_MEETINGS"],
  ];

  for (const [pattern, intent] of rules) {
    if (pattern.test(text)) return { intent, confidence: 0.4 };
  }
  return { intent: "GENERAL_CHAT", confidence: 0.3 };
}

/** Detects intent for one message. Exactly one AI call — see Feature 10 (avoid duplicate AI calls). */
export async function detectIntent(message: string): Promise<IntentDetectionResult> {
  const result = await aiService.generateText(buildIntentPrompt(message), { maxRetries: 1 });

  if (!result.success) {
    return detectIntentHeuristically(message);
  }

  try {
    const parsed = parseJsonResponse<{ intent: string; confidence: number }>(result.data, ["intent", "confidence"]);
    if (!isKnownIntent(parsed.intent)) {
      // A well-formed response naming an intent we don't recognize — treat
      // as an unknown/unclear intent rather than trusting a hallucinated value.
      return { intent: "GENERAL_CHAT", confidence: 0.3 };
    }
    return { intent: parsed.intent, confidence: clampConfidence(parsed.confidence) };
  } catch {
    // Malformed/unparseable AI response — degrade to the heuristic instead
    // of failing the whole chat request over a classification hiccup.
    return detectIntentHeuristically(message);
  }
}
