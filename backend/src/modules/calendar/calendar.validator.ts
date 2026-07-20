import { z } from "zod";

const uuid = (label: string) => z.string().uuid(`${label} must be a valid id`);
const dateTime = z.coerce.date({ errorMap: () => ({ message: "Must be a valid date/time" }) });
const participantList = z.array(uuid("participant id")).max(200, "Too many participants").optional().default([]);

export const scheduleMeetingSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
    description: z.string().trim().max(5000, "Description is too long").optional(),
    tag: z.string().trim().max(60, "Tag is too long").optional(),
    scheduledStart: dateTime,
    scheduledEnd: dateTime,
    participantIds: participantList,
  })
  .refine((data) => data.scheduledEnd > data.scheduledStart, {
    message: "scheduledEnd must be after scheduledStart",
    path: ["scheduledEnd"],
  });
export type ScheduleMeetingSchema = z.infer<typeof scheduleMeetingSchema>;

export const checkAvailabilitySchema = z
  .object({
    start: dateTime,
    end: dateTime,
    participants: participantList,
  })
  .refine((data) => data.end > data.start, {
    message: "end must be after start",
    path: ["end"],
  });
export type CheckAvailabilitySchema = z.infer<typeof checkAvailabilitySchema>;

export const calendarViewQuerySchema = z
  .object({
    view: z.enum(["day", "week", "month"]).optional().default("month"),
    startDate: dateTime.optional(),
    endDate: dateTime.optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate > data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });
export type CalendarViewQuerySchema = z.infer<typeof calendarViewQuerySchema>;

export const upcomingQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100, "limit must be 100 or less").optional().default(20),
});
export type UpcomingQuerySchema = z.infer<typeof upcomingQuerySchema>;
