import { prisma } from "../../lib/prisma";
import type { TaskPriority, TaskStatus } from "@prisma/client";

const assigneeSelect = {
  select: { id: true, firstName: true, lastName: true, email: true },
} as const;

/**
 * Read-only lookup used purely for organization-scoping, host
 * identification, and due-date validation against the meeting's start
 * time — this module never writes to Meeting, so it doesn't touch the
 * meetings module's own repository.
 */
export function findMeetingContext(meetingId: string) {
  return prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { id: true, hostId: true, scheduledStart: true, host: { select: { organizationId: true } } },
  });
}

/**
 * Read-only lookup used purely to confirm "a task can only be assigned to
 * a participant of that meeting" — this module never writes to
 * Participant, so it doesn't touch the participants module's own
 * repository.
 */
export function findParticipant(meetingId: string, userId: string) {
  return prisma.participant.findUnique({
    where: { meetingId_userId: { meetingId, userId } },
    select: { id: true },
  });
}

export function findTaskById(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: assigneeSelect,
      meeting: {
        select: { id: true, hostId: true, scheduledStart: true, host: { select: { organizationId: true } } },
      },
    },
  });
}

export function listTasksByMeeting(meetingId: string) {
  return prisma.task.findMany({
    where: { meetingId },
    include: { assignee: assigneeSelect },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function createTask(
  meetingId: string,
  input: { title: string; description?: string; assignedTo: string; priority?: TaskPriority; dueDate?: Date }
) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
      meetingId,
      assigneeId: input.assignedTo,
    },
    include: { assignee: assigneeSelect },
  });
}

export function updateTask(
  taskId: string,
  data: { title?: string; description?: string; priority?: TaskPriority; status?: TaskStatus; dueDate?: Date }
) {
  return prisma.task.update({
    where: { id: taskId },
    data,
    include: { assignee: assigneeSelect },
  });
}

export function deleteTask(taskId: string) {
  return prisma.task.delete({ where: { id: taskId } });
}
