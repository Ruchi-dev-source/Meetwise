import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as attendanceController from "./attendance.controller";

export const attendanceRouter = Router({ mergeParams: true });

attendanceRouter.use(authenticate);

attendanceRouter.post("/", attendanceController.markOwnAttendance);
attendanceRouter.get("/", attendanceController.listAttendance);
attendanceRouter.patch("/:userId", attendanceController.updateAttendance);
