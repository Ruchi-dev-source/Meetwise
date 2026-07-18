import type { Task, TaskStatus, TaskPriority } from "@prisma/client";

/** A task with just enough assignee info to render a list/detail view — never the full User record. */
export type TaskWithAssignee = Task & {
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedTo: string;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
}

/** The subset an EMPLOYEE is allowed to touch on their own assigned task. */
export interface UpdateTaskStatusInput {
  status: TaskStatus;
}
