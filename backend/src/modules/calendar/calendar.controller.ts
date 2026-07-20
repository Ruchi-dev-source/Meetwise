import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as calendarService from "./calendar.service";
import {
  scheduleMeetingSchema,
  checkAvailabilitySchema,
  calendarViewQuerySchema,
  upcomingQuerySchema,
} from "./calendar.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const scheduleMeeting = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = scheduleMeetingSchema.parse(req.body);

  const result = await calendarService.scheduleMeeting(input, user);

  if (result.conflict) {
    // Deliberately not routed through sendSuccess/ApiError — the spec
    // requires this exact shape ({ success: false, message, conflicts }),
    // which doesn't fit the generic error envelope's `errors` field name.
    return res.status(409).json({
      success: false,
      message: "Scheduling conflict detected.",
      conflicts: result.conflicts,
    });
  }

  return sendSuccess(res, 201, "Meeting scheduled", { meeting: result.meeting });
});

export const checkAvailability = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const input = checkAvailabilitySchema.parse(req.body);

  const result = await calendarService.checkAvailability(input, user);
  return sendSuccess(res, 200, "Availability checked", result);
});

export const getCalendarView = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { view, startDate, endDate } = calendarViewQuerySchema.parse(req.query);

  const calendar = await calendarService.getCalendarView(view, startDate, endDate, user);
  return sendSuccess(res, 200, "Calendar retrieved", calendar);
});

export const getUpcomingMeetings = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { limit } = upcomingQuerySchema.parse(req.query);

  const meetings = await calendarService.getUpcomingMeetings(user, limit);
  return sendSuccess(res, 200, "Upcoming meetings retrieved", { meetings });
});

export const getTodaysMeetings = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const meetings = await calendarService.getTodaysMeetings(user);
  return sendSuccess(res, 200, "Today's meetings retrieved", { meetings });
});
