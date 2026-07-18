import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as taskService from "./task.service";
import { meetingIdParamSchema, taskIdParamSchema, createTaskSchema, updateTaskSchema } from "./task.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);
  const input = createTaskSchema.parse(req.body);

  const task = await taskService.createTask(meetingId, input, user);
  return sendSuccess(res, 201, "Task created", { task });
});

export const listMeetingTasks = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);

  const tasks = await taskService.listMeetingTasks(meetingId, user);
  return sendSuccess(res, 200, "Tasks retrieved", { tasks });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { taskId } = taskIdParamSchema.parse(req.params);

  const task = await taskService.getTaskById(taskId, user);
  return sendSuccess(res, 200, "Task retrieved", { task });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { taskId } = taskIdParamSchema.parse(req.params);
  const input = updateTaskSchema.parse(req.body);

  const task = await taskService.updateTask(taskId, input, user);
  return sendSuccess(res, 200, "Task updated", { task });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { taskId } = taskIdParamSchema.parse(req.params);

  await taskService.deleteTask(taskId, user);
  return res.status(204).send();
});
