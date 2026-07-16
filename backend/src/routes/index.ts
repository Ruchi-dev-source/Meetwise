import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes";
import { authRouter } from "../modules/auth";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);

// Phase 3+: apiRouter.use("/meetings", meetingRouter);
// Phase 3+: apiRouter.use("/tasks", taskRouter);
// Phase 3+: apiRouter.use("/attendance", attendanceRouter);
// Phase 3+: apiRouter.use("/notifications", notificationRouter);
// Phase 3+: apiRouter.use("/files", fileRouter);
