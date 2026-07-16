import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes";
import { authRouter } from "../modules/auth";
import { meetingRouter } from "../modules/meetings";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/meetings", meetingRouter);

// Phase 4+: apiRouter.use("/tasks", taskRouter);
// Phase 4+: apiRouter.use("/attendance", attendanceRouter);
// Phase 4+: apiRouter.use("/notifications", notificationRouter);
// Phase 4+: apiRouter.use("/files", fileRouter);
