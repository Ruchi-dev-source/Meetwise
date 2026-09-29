import { aiService } from "../ai";
import { MAX_RECOMMENDATIONS } from "./scheduling.constants";
import type { SchedulingRecommendation } from "./scheduling.types";
import type { AvailableSlot } from "../calendar";

function chronologicalFallback(slots: AvailableSlot[]): SchedulingRecommendation[] {
  return slots.slice(0, MAX_RECOMMENDATIONS).map((slot, index) => ({
    rank: index + 1,
    start: slot.start.toISOString(),
    end: slot.end.toISOString(),
    reason: index === 0 ? "Earliest slot where everyone is free" : "Also available for everyone",
    confidence: index === 0 ? 0.8 : 0.6,
  }));
}

function buildRankingPrompt(slots: AvailableSlot[], title: string, hadConflict: boolean): string {
  return [
    hadConflict
      ? "The user's originally preferred meeting time had a scheduling conflict."
      : "Recommend the best meeting time from the candidates below.",
    `Meeting title: "${title}"`,
    "Candidate slots, all already confirmed free for every participant:",
    JSON.stringify(slots.map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() }))),
    `Pick and rank up to ${MAX_RECOMMENDATIONS} of these, best first. Respond with ONLY a JSON array, no other text, in this exact shape:`,
    JSON.stringify([{ start: "ISO datetime from the candidates above", end: "ISO datetime from the candidates above", reason: "short natural-language reason", confidence: "number 0-1" }]),
    "Only use start/end values that exactly match one of the candidate slots above — never invent a new time.",
  ].join("\n");
}

function isValidRankedSlot(value: unknown, validStartTimes: Set<string>): value is { start: string; end: string; reason: string; confidence: number } {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.start === "string" &&
    typeof v.end === "string" &&
    typeof v.reason === "string" &&
    typeof v.confidence === "number" &&
    validStartTimes.has(v.start)
  );
}

/**
 * Gemini never invents times here — it only ranks/annotates slots the
 * deterministic search already proved are free, and any AI-returned slot
 * not matching one of the real candidates is discarded. Falls back to
 * chronological order if AI is unavailable or returns something unusable.
 */
export async function rankRecommendations(
  slots: AvailableSlot[],
  title: string,
  hadConflict: boolean
): Promise<SchedulingRecommendation[]> {
  if (slots.length === 0) return [];

  const result = await aiService.generateText(buildRankingPrompt(slots, title, hadConflict), { maxRetries: 1 });
  if (!result.success) return chronologicalFallback(slots);

  try {
    const validStartTimes = new Set(slots.map((s) => s.start.toISOString()));
    const parsed = JSON.parse(result.data);
    if (!Array.isArray(parsed)) return chronologicalFallback(slots);

    const ranked = parsed
      .filter((item): item is { start: string; end: string; reason: string; confidence: number } => isValidRankedSlot(item, validStartTimes))
      .slice(0, MAX_RECOMMENDATIONS)
      .map((item, index) => ({
        rank: index + 1,
        start: item.start,
        end: item.end,
        reason: item.reason,
        confidence: Math.min(Math.max(item.confidence, 0), 1),
      }));

    return ranked.length > 0 ? ranked : chronologicalFallback(slots);
  } catch {
    return chronologicalFallback(slots);
  }
}
