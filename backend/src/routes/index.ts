import { Router } from "express";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);

// Phase 2+: apiRouter.use("/auth", authRouter);
// Phase 2+: apiRouter.use("/users", userRouter);
// Phase 2+: apiRouter.use("/meetings", meetingRouter);
// Phase 2+: apiRouter.use("/tasks", taskRouter);
// Phase 2+: apiRouter.use("/attendance", attendanceRouter);
// Phase 2+: apiRouter.use("/notifications", notificationRouter);
// Phase 2+: apiRouter.use("/files", fileRouter);
