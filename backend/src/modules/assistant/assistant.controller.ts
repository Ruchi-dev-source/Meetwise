import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as assistantService from "./assistant.service";
import { assistantChatSchema } from "./assistant.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { message } = assistantChatSchema.parse(req.body);

  const result = await assistantService.chat({ message }, user);
  return sendSuccess(res, 200, "Assistant response generated", result);
});
