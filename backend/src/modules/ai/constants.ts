import type { AIErrorCode } from "./ai.types";

export const AI_PROVIDER_NAME = "Gemini";

export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
export const DEFAULT_TIMEOUT_MS = 30_000;
export const DEFAULT_MAX_RETRIES = 2;

/** Error codes worth retrying automatically — transient/provider-side, not caller mistakes. */
export const RETRYABLE_ERROR_CODES: AIErrorCode[] = ["RATE_LIMITED", "TIMEOUT", "PROVIDER_UNAVAILABLE"];

/** Base delay for exponential backoff between retries, in milliseconds. */
export const RETRY_BASE_DELAY_MS = 250;
