import { z } from "zod";

export const assistantChatSchema = z
  .object({
    message: z.string().trim().min(1, "message is required").max(2000, "message is too long").optional(),
    confirmation: z.boolean().optional(),
    selectedRecommendation: z.number().int().positive().optional(),
  })
  .refine((data) => data.message !== undefined || data.confirmation !== undefined, {
    message: "Either message or confirmation must be provided",
    path: ["message"],
  })
  .refine((data) => !data.confirmation || data.selectedRecommendation !== undefined, {
    message: "selectedRecommendation is required when confirmation is true",
    path: ["selectedRecommendation"],
  });
export type AssistantChatSchema = z.infer<typeof assistantChatSchema>;
