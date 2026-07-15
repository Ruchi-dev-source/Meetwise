import type { User, Role } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // already hashed by the time it reaches the repository
  role: Role;
  organizationId: string;
}
