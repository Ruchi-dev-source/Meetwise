import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes";
import { authRouter } from "../modules/auth";
import { meetingRouter } from "../modules/meetings";
import { participantRouter } from "../modules/participants";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/meetings/:meetingId/participants", participantRouter);
apiRouter.use("/meetings", meetingRouter);

// Phase 5+: apiRouter.use("/tasks", taskRouter);
// Phase 5+: apiRouter.use("/attendance", attendanceRouter);
// Phase 5+: apiRouter.use("/notifications", notificationRouter);
// Phase 5+: apiRouter.use("/files", fileRouter);
