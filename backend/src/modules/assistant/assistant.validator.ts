import { z } from "zod";

export const assistantChatSchema = z.object({
  message: z.string().trim().min(1, "message is required").max(2000, "message is too long"),
});
export type AssistantChatSchema = z.infer<typeof assistantChatSchema>;
