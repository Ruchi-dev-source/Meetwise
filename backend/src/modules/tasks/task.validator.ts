import { z } from "zod";

const uuid = (label: string) => z.string().uuid(`${label} must be a valid id`);

export const meetingIdParamSchema = z.object({
  meetingId: uuid("meetingId"),
});

export const taskIdParamSchema = z.object({
  taskId: uuid("taskId"),
});

const taskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);
const taskStatus = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);
const dateTime = z.coerce.date({ errorMap: () => ({ message: "Must be a valid date/time" }) });

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().trim().max(5000, "Description is too long").optional(),
  assignedTo: uuid("assignedTo"),
  priority: taskPriority.optional(),
  dueDate: dateTime.optional(),
});
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long").optional(),
    description: z.string().trim().max(5000, "Description is too long").optional(),
    priority: taskPriority.optional(),
    status: taskStatus.optional(),
    dueDate: dateTime.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

/** What an EMPLOYEE is allowed to send — status only. Enforced again in the service layer, not just here. */
export const updateTaskStatusSchema = z.object({
  status: taskStatus,
});
export type UpdateTaskStatusSchema = z.infer<typeof updateTaskStatusSchema>;
