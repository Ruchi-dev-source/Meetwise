import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as aiService from "./ai.service";
import { testPromptSchema } from "./ai.validator";
import type { AIErrorCode } from "./ai.types";

const STATUS_BY_ERROR_CODE: Record<AIErrorCode, number> = {
  NOT_CONFIGURED: 503,
  INVALID_API_KEY: 500,
  RATE_LIMITED: 429,
  TIMEOUT: 504,
  PROVIDER_UNAVAILABLE: 502,
  MALFORMED_RESPONSE: 502,
  UNKNOWN: 500,
};

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const status = aiService.getAiStatus();
  return sendSuccess(res, 200, "AI provider status", status);
});

/**
 * DEV-ONLY test endpoint (Feature 7). Not mounted at all in production —
 * see ai.routes.ts. Requires authentication even in non-production
 * environments, since it triggers a real, potentially costly external
 * API call.
 */
export const testPrompt = asyncHandler(async (req: Request, res: Response) => {
  const { prompt } = testPromptSchema.parse(req.body);

  const result = await aiService.generateText(prompt);
  if (!result.success) {
    throw new ApiError(STATUS_BY_ERROR_CODE[result.code], result.message);
  }

  return sendSuccess(res, 200, "AI response generated", result);
});
