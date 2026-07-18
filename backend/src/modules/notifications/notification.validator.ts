import { z } from "zod";

export const notificationIdParamSchema = z.object({
  notificationId: z.string().uuid("notificationId must be a valid id"),
});
export type NotificationIdParamSchema = z.infer<typeof notificationIdParamSchema>;
