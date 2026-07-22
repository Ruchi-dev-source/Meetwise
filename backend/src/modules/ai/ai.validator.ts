import { z } from "zod";

export const testPromptSchema = z.object({
  prompt: z.string().trim().min(1, "prompt is required").max(4000, "prompt is too long"),
});
export type TestPromptSchema = z.infer<typeof testPromptSchema>;
