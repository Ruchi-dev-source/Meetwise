import { env } from "../../config/env";
import { AIServiceError } from "./errors";
import { DEFAULT_GEMINI_MODEL, DEFAULT_TIMEOUT_MS } from "./constants";
import type { AIProvider, AIProviderCallResult, AITokenUsage } from "./ai.types";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiGenerateContentResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

function extractTokenUsage(body: GeminiGenerateContentResponse): AITokenUsage | undefined {
  const usage = body.usageMetadata;
  if (!usage) return undefined;
  return {
    promptTokens: usage.promptTokenCount,
    completionTokens: usage.candidatesTokenCount,
    totalTokens: usage.totalTokenCount,
  };
}

class GeminiProvider implements AIProvider {
  readonly name = "Gemini";

  isConfigured(): boolean {
    return Boolean(env.GEMINI_API_KEY?.trim());
  }

  async generate(prompt: string): Promise<AIProviderCallResult> {
    if (!this.isConfigured()) {
      throw AIServiceError.notConfigured("GEMINI_API_KEY is not set");
    }

    const model = env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
    const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
    const timeoutMs = env.GEMINI_TIMEOUT_MS || DEFAULT_TIMEOUT_MS;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw AIServiceError.timeout(`Gemini request timed out after ${timeoutMs}ms`);
      }
      throw AIServiceError.providerUnavailable("Could not reach Gemini");
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 401 || response.status === 403) {
      throw AIServiceError.invalidApiKey();
    }
    if (response.status === 429) {
      throw AIServiceError.rateLimited();
    }
    if (!response.ok) {
      throw AIServiceError.providerUnavailable(`Gemini returned HTTP ${response.status}`);
    }

    const body = (await response.json().catch(() => null)) as GeminiGenerateContentResponse | null;
    if (!body) {
      throw AIServiceError.malformedResponse("Gemini response was not valid JSON");
    }

    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string" || text.length === 0) {
      throw AIServiceError.malformedResponse("Gemini response did not contain any text content");
    }

    return { text, model, tokenUsage: extractTokenUsage(body) };
  }
}

// One instance, reused for the lifetime of the process (Feature 12 — avoid
// repeated initialization). There's no persistent connection object to
// hold onto with a stateless REST call, but this keeps the door open for
// a real SDK client later without changing this module's public shape.
export const geminiProvider: AIProvider = new GeminiProvider();
