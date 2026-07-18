import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes";
import { authRouter } from "../modules/auth";
import { meetingRouter } from "../modules/meetings";
import { participantRouter } from "../modules/participants";
import { attendanceRouter } from "../modules/attendance";
import { meetingTaskRouter, taskRouter } from "../modules/tasks";
import { notificationRouter } from "../modules/notifications";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/meetings/:meetingId/participants", participantRouter);
apiRouter.use("/meetings/:meetingId/attendance", attendanceRouter);
apiRouter.use("/meetings/:meetingId/tasks", meetingTaskRouter);
apiRouter.use("/meetings", meetingRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/notifications", notificationRouter);

// Phase 8+: apiRouter.use("/files", fileRouter);
