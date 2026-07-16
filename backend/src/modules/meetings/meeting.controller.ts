import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as meetingService from "./meeting.service";
import { createMeetingSchema, updateMeetingSchema, listMeetingsQuerySchema } from "./meeting.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const createMeeting = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = createMeetingSchema.parse(req.body);

  const meeting = await meetingService.createMeeting(input, user);
  return sendSuccess(res, 201, "Meeting created", { meeting });
});

export const listMeetings = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const filter = listMeetingsQuerySchema.parse(req.query);

  const meetings = await meetingService.listMeetings(filter, user);
  return sendSuccess(res, 200, "Meetings retrieved", { meetings });
});

export const getMeetingById = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const meeting = await meetingService.getMeetingById(req.params.id, user);
  return sendSuccess(res, 200, "Meeting retrieved", { meeting });
});

export const updateMeeting = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = updateMeetingSchema.parse(req.body);

  const meeting = await meetingService.updateMeeting(req.params.id, input, user);
  return sendSuccess(res, 200, "Meeting updated", { meeting });
});

export const deleteMeeting = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  await meetingService.deleteMeeting(req.params.id, user);
  return sendSuccess(res, 200, "Meeting deleted", null);
});
