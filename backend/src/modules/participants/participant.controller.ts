import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as participantService from "./participant.service";
import {
  meetingIdParamSchema,
  participantParamsSchema,
  inviteParticipantSchema,
  selfUpdateParticipantSchema,
} from "./participant.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const inviteParticipant = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);
  const input = inviteParticipantSchema.parse(req.body);

  const participant = await participantService.inviteParticipant(meetingId, input, user);
  return sendSuccess(res, 201, "Participant added", { participant });
});

export const listParticipants = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);

  const participants = await participantService.listParticipants(meetingId, user);
  return sendSuccess(res, 200, "Participants retrieved", { participants });
});

export const removeParticipant = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId, userId } = participantParamsSchema.parse(req.params);

  await participantService.removeParticipant(meetingId, userId, user);
  return sendSuccess(res, 200, "Participant removed", null);
});

export const updateSelfParticipant = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);
  const { action } = selfUpdateParticipantSchema.parse(req.body);

  const participant = await participantService.updateSelfParticipant(meetingId, action, user);
  return sendSuccess(res, 200, "Participant status updated", { participant });
});
