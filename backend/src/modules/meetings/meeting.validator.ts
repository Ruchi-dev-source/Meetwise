import { z } from "zod";
import { MeetingStatus } from "@prisma/client";

const title = z.string().trim().min(1, "Title is required").max(200, "Title is too long");
const description = z.string().trim().max(5000, "Description is too long").optional();
const tag = z.string().trim().max(60, "Tag is too long").optional();
const status = z.nativeEnum(MeetingStatus).optional();

// Accepts ISO date strings from the client, coerces to Date for Prisma.
const dateTime = z.coerce.date({ errorMap: () => ({ message: "Must be a valid date/time" }) });

export const createMeetingSchema = z
  .object({
    title,
    description,
    tag,
    scheduledStart: dateTime,
    scheduledEnd: dateTime,
    status,
  })
  .refine((data) => data.scheduledEnd > data.scheduledStart, {
    message: "scheduledEnd must be after scheduledStart",
    path: ["scheduledEnd"],
  });
export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;

export const updateMeetingSchema = z
  .object({
    title: title.optional(),
    description,
    tag,
    scheduledStart: dateTime.optional(),
    scheduledEnd: dateTime.optional(),
    status,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  })
  .refine(
    (data) => !data.scheduledStart || !data.scheduledEnd || data.scheduledEnd > data.scheduledStart,
    { message: "scheduledEnd must be after scheduledStart", path: ["scheduledEnd"] }
  );
export type UpdateMeetingSchema = z.infer<typeof updateMeetingSchema>;

export const listMeetingsQuerySchema = z.object({
  status: status,
});
export type ListMeetingsQuerySchema = z.infer<typeof listMeetingsQuerySchema>;
