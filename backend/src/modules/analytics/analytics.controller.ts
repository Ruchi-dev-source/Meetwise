import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as analyticsService from "./analytics.service";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const dashboard = await analyticsService.getDashboardAnalytics(user);
  return sendSuccess(res, 200, "Dashboard analytics retrieved", dashboard);
});

export const getMeetingAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const meetings = await analyticsService.getMeetingStats(user.organizationId);
  return sendSuccess(res, 200, "Meeting analytics retrieved", meetings);
});

export const getTaskAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const tasks = await analyticsService.getTaskStats(user.organizationId);
  return sendSuccess(res, 200, "Task analytics retrieved", tasks);
});

export const getAttendanceAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const attendance = await analyticsService.getAttendanceStats(user.organizationId);
  return sendSuccess(res, 200, "Attendance analytics retrieved", attendance);
});
