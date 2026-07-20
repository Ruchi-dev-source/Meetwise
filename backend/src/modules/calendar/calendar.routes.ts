import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as calendarController from "./calendar.controller";

export const calendarRouter = Router();

calendarRouter.use(authenticate);

calendarRouter.post("/schedule", calendarController.scheduleMeeting);
calendarRouter.post("/check-availability", calendarController.checkAvailability);
calendarRouter.get("/upcoming", calendarController.getUpcomingMeetings);
calendarRouter.get("/today", calendarController.getTodaysMeetings);
calendarRouter.get("/", calendarController.getCalendarView);
