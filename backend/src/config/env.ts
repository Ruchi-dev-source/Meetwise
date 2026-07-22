import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    CLIENT_ORIGIN: z.string().min(1, "CLIENT_ORIGIN is required"),
    JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
    COOKIE_SECRET: z.string().min(16, "COOKIE_SECRET must be at least 16 characters"),

    // AI foundation (see modules/ai) — everything here is optional/defaulted
    // so an environment that never touches AI features boots exactly as it
    // did before this was added. AI_ENABLED is the explicit opt-in switch;
    // only when it's true does a missing GEMINI_API_KEY fail startup (see
    // the .refine() below), matching Feature 5's "fail fast if configured
    // to use Gemini but no API key is present."
    AI_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    GEMINI_API_KEY: z.string().optional(),
    GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
    GEMINI_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
    AI_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  })
  .refine((data) => !data.AI_ENABLED || Boolean(data.GEMINI_API_KEY?.trim()), {
    message: "GEMINI_API_KEY is required when AI_ENABLED=true",
    path: ["GEMINI_API_KEY"],
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration — see errors above.");
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
