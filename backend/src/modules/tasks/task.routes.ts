import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as taskController from "./task.controller";

/** Mounted at /meetings/:meetingId/tasks — mergeParams so :meetingId is available. */
export const meetingTaskRouter = Router({ mergeParams: true });
meetingTaskRouter.use(authenticate);
meetingTaskRouter.post("/", taskController.createTask);
meetingTaskRouter.get("/", taskController.listMeetingTasks);

/** Mounted at /tasks — operates on a task directly by id, independent of the meeting-nested path. */
export const taskRouter = Router();
taskRouter.use(authenticate);
taskRouter.get("/:taskId", taskController.getTaskById);
taskRouter.patch("/:taskId", taskController.updateTask);
taskRouter.delete("/:taskId", taskController.deleteTask);
