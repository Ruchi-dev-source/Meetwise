import type { AIErrorCode } from "./ai.types";

export class AIServiceError extends Error {
  public readonly code: AIErrorCode;

  constructor(code: AIErrorCode, message: string) {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
    Error.captureStackTrace?.(this, AIServiceError);
  }

  static notConfigured(message = "AI provider is not configured") {
    return new AIServiceError("NOT_CONFIGURED", message);
  }
  static invalidApiKey(message = "AI provider rejected the API key") {
    return new AIServiceError("INVALID_API_KEY", message);
  }
  static rateLimited(message = "AI provider rate limit exceeded") {
    return new AIServiceError("RATE_LIMITED", message);
  }
  static timeout(message = "AI provider request timed out") {
    return new AIServiceError("TIMEOUT", message);
  }
  static providerUnavailable(message = "AI provider is currently unavailable") {
    return new AIServiceError("PROVIDER_UNAVAILABLE", message);
  }
  static malformedResponse(message = "AI provider returned a malformed response") {
    return new AIServiceError("MALFORMED_RESPONSE", message);
  }
  static unknown(message = "AI provider request failed") {
    return new AIServiceError("UNKNOWN", message);
  }
}
