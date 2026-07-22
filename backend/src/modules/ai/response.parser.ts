import { AIServiceError } from "./errors";

/** Models often wrap JSON in ```json ... ``` code fences — strip that before parsing. */
function stripCodeFences(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return fenced ? fenced[1].trim() : text;
}

/** Validates and trims a plain-text response. Throws on empty/whitespace-only content. */
export function parseTextResponse(rawText: string | null | undefined): string {
  if (rawText == null || rawText.trim().length === 0) {
    throw AIServiceError.malformedResponse("AI provider returned an empty response");
  }
  return rawText.trim();
}

/**
 * Parses a response expected to contain a JSON object, optionally checking
 * that a set of fields are present. Never throws a raw JSON.parse error —
 * every failure mode (empty, malformed JSON, non-object JSON, missing
 * field) becomes a standardized AIServiceError with code MALFORMED_RESPONSE.
 */
export function parseJsonResponse<T extends object>(
  rawText: string | null | undefined,
  requiredFields: (keyof T)[] = []
): T {
  const text = parseTextResponse(rawText);
  const cleaned = stripCodeFences(text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw AIServiceError.malformedResponse("AI provider response was not valid JSON");
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw AIServiceError.malformedResponse("AI provider response was not a JSON object");
  }

  for (const field of requiredFields) {
    if (!(field in parsed)) {
      throw AIServiceError.malformedResponse(`AI provider response is missing required field: ${String(field)}`);
    }
  }

  return parsed as T;
}
