import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as analyticsController from "./analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate);

analyticsRouter.get("/dashboard", analyticsController.getDashboard);
analyticsRouter.get("/meetings", analyticsController.getMeetingAnalytics);
analyticsRouter.get("/tasks", analyticsController.getTaskAnalytics);
analyticsRouter.get("/attendance", analyticsController.getAttendanceAnalytics);
