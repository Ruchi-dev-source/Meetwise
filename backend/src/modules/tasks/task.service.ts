import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedUser } from "../../types/express";
import * as taskRepository from "./task.repository";
import type { CreateTaskInput, UpdateTaskInput } from "./task.types";

interface MeetingContext {
  hostId: string;
  organizationId: string;
  scheduledStart: Date;
}

/**
 * Confirms the meeting exists in the caller's organization (404s otherwise,
 * same "don't leak existence across orgs" pattern as meetings/participants/
 * attendance), and returns just enough to authorize/scope what follows.
 */
async function getMeetingContext(meetingId: string, user: AuthenticatedUser): Promise<MeetingContext> {
  const meeting = await taskRepository.findMeetingContext(meetingId);
  if (!meeting || meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("Meeting not found");
  }
  return { hostId: meeting.hostId, organizationId: meeting.host.organizationId, scheduledStart: meeting.scheduledStart };
}

function isHostOrAdmin(user: AuthenticatedUser, hostId: string): boolean {
  return user.id === hostId || user.role === "ADMIN";
}

function assertHostOrAdmin(user: AuthenticatedUser, hostId: string) {
  if (!isHostOrAdmin(user, hostId)) {
    throw ApiError.forbidden("Only the meeting host or an organization admin can do this");
  }
}

async function isParticipant(meetingId: string, userId: string): Promise<boolean> {
  const participant = await taskRepository.findParticipant(meetingId, userId);
  return participant !== null;
}

function assertDueDateValid(dueDate: Date | undefined, scheduledStart: Date) {
  if (dueDate && dueDate < scheduledStart) {
    throw ApiError.badRequest("dueDate cannot be before the meeting start time");
  }
}

export async function createTask(meetingId: string, input: CreateTaskInput, user: AuthenticatedUser) {
  const meeting = await getMeetingContext(meetingId, user);
  assertHostOrAdmin(user, meeting.hostId);

  if (!(await isParticipant(meetingId, input.assignedTo))) {
    throw ApiError.badRequest("Tasks can only be assigned to a participant of this meeting");
  }
  assertDueDateValid(input.dueDate, meeting.scheduledStart);

  return taskRepository.createTask(meetingId, input);
}

export async function listMeetingTasks(meetingId: string, user: AuthenticatedUser) {
  const meeting = await getMeetingContext(meetingId, user);

  if (!isHostOrAdmin(user, meeting.hostId) && !(await isParticipant(meetingId, user.id))) {
    throw ApiError.forbidden("You must be a participant of this meeting to view its tasks");
  }

  return taskRepository.listTasksByMeeting(meetingId);
}

export async function getTaskById(taskId: string, user: AuthenticatedUser) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task || !task.meeting || task.meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("Task not found");
  }

  if (!isHostOrAdmin(user, task.meeting.hostId) && !(await isParticipant(task.meeting.id, user.id))) {
    throw ApiError.forbidden("You must be a participant of this meeting to view this task");
  }

  return task;
}

export async function updateTask(taskId: string, input: UpdateTaskInput, user: AuthenticatedUser) {
  const task = await taskRepository.findTaskById(taskId);
  if (!task || !task.meeting || task.meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("Task not found");
  }

  if (isHostOrAdmin(user, task.meeting.hostId)) {
    assertDueDateValid(input.dueDate, task.meeting.scheduledStart);
    return taskRepository.updateTask(taskId, input);
  }

  // Not host/admin — must be the assignee, and may only ever change `status`.
  if (task.assigneeId !== user.id) {
    throw ApiError.forbidden("Only the meeting host, an organization admin, or this task's assignee can update it");
  }

  const attemptedFields = Object.keys(input);
  const disallowed = attemptedFields.filter((field) => field !== "status");
  if (disallowed.length > 0 || !input.status) {
    throw ApiError.forbidden("You may only update the status of a task assigned to you");
  }

  return taskRepository.updateTask(taskId, { status: input.status });
}

export async function deleteTask(taskId: string, user: AuthenticatedUser): Promise<void> {
  const task = await taskRepository.findTaskById(taskId);
  if (!task || !task.meeting || task.meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("Task not found");
  }

  assertHostOrAdmin(user, task.meeting.hostId);
  await taskRepository.deleteTask(taskId);
}
