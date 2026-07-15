import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number");
const name = (label: string) =>
  z.string().trim().min(1, `${label} is required`).max(80, `${label} is too long`);

export const registerSchema = z.object({
  organizationName: name("Organization name").min(2, "Organization name must be at least 2 characters"),
  firstName: name("First name"),
  lastName: name("Last name"),
  email,
  password,
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});
export type LoginSchema = z.infer<typeof loginSchema>;
