import { env } from "../../config/env";
import { geminiProvider } from "./gemini.service";
import { AIServiceError } from "./errors";
import { AI_PROVIDER_NAME, DEFAULT_MAX_RETRIES, RETRY_BASE_DELAY_MS, RETRYABLE_ERROR_CODES } from "./constants";
import type { AIHealthStatus, AIProvider, AIResult, AITokenUsage } from "./ai.types";

// Feature 10 (provider abstraction): this module depends only on the
// AIProvider interface. Swapping Gemini for OpenAI/Claude/Azure OpenAI
// later means writing a new module implementing that same interface and
// changing this one line — nothing else here, and nothing in any
// controller, needs to change.
const provider: AIProvider = geminiProvider;

function isRetryable(err: AIServiceError): boolean {
  return RETRYABLE_ERROR_CODES.includes(err.code);
}

function toAIServiceError(err: unknown): AIServiceError {
  if (err instanceof AIServiceError) return err;
  return AIServiceError.unknown(err instanceof Error ? err.message : "Unknown AI provider error");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Feature 11: log provider/latency/success/token-usage — never the prompt
// or response content, which may contain sensitive meeting data.
function logAiCall(entry: {
  success: boolean;
  latencyMs: number;
  errorCode?: string;
  tokenUsage?: AITokenUsage;
}): void {
  const parts = [`provider=${AI_PROVIDER_NAME}`, `success=${entry.success}`, `latencyMs=${entry.latencyMs}`];
  if (entry.errorCode) parts.push(`errorCode=${entry.errorCode}`);
  if (entry.tokenUsage) parts.push(`tokenUsage=${JSON.stringify(entry.tokenUsage)}`);
  console.log(`[ai] ${parts.join(" ")}`);
}

/**
 * The single entry point for calling the configured AI provider. Every
 * future AI feature (summaries, scheduling, action items, chat, dashboard
 * insights) calls this — no other module should ever import
 * gemini.service.ts directly.
 *
 * Retries transient failures (rate limit, timeout, provider-unavailable)
 * with exponential backoff; validation-type failures (not configured,
 * invalid key, malformed response) fail immediately since retrying them
 * can't help.
 */
export async function generateText(prompt: string, options: { maxRetries?: number } = {}): Promise<AIResult<string>> {
  const maxRetries = options.maxRetries ?? env.AI_MAX_RETRIES ?? DEFAULT_MAX_RETRIES;
  const startedAt = Date.now();

  let lastError: AIServiceError = AIServiceError.unknown("AI request never attempted");

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await provider.generate(prompt);
      const latencyMs = Date.now() - startedAt;
      logAiCall({ success: true, latencyMs, tokenUsage: result.tokenUsage });

      return {
        success: true,
        provider: provider.name,
        model: result.model,
        data: result.text,
        latencyMs,
        tokenUsage: result.tokenUsage,
      };
    } catch (err) {
      lastError = toAIServiceError(err);
      const hasRetriesLeft = attempt < maxRetries;
      if (hasRetriesLeft && isRetryable(lastError)) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
        continue;
      }
      break;
    }
  }

  const latencyMs = Date.now() - startedAt;
  logAiCall({ success: false, latencyMs, errorCode: lastError.code });

  return { success: false, code: lastError.code, message: lastError.message };
}

/**
 * Feature 6's health status. Deliberately does NOT make a live round-trip
 * to Gemini on every call — that would be slow and burn API quota just to
 * answer a health check. `available` reflects whether the provider is
 * configured and ready to be used, not a live connectivity probe.
 */
export function getAiStatus(): AIHealthStatus {
  const configured = provider.isConfigured();
  return { provider: provider.name, configured, available: configured };
}
