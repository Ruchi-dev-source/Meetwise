import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as attendanceService from "./attendance.service";
import {
  meetingIdParamSchema,
  attendanceParamsSchema,
  markAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const markOwnAttendance = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);
  const input = markAttendanceSchema.parse(req.body);

  const attendance = await attendanceService.markOwnAttendance(meetingId, input, user);
  return sendSuccess(res, 201, "Attendance marked", { attendance });
});

export const listAttendance = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);

  const attendance = await attendanceService.listAttendance(meetingId, user);
  return sendSuccess(res, 200, "Attendance retrieved", { attendance });
});

export const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId, userId } = attendanceParamsSchema.parse(req.params);
  const { status } = updateAttendanceSchema.parse(req.body);

  const attendance = await attendanceService.updateAttendance(meetingId, userId, status, user);
  return sendSuccess(res, 200, "Attendance updated", { attendance });
});
