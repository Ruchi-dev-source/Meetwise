import { prisma } from "../../lib/prisma";
import type { User } from "@prisma/client";
import type { CreateUserInput } from "./users.types";

export function createUser(input: CreateUserInput): Promise<User> {
  return prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      role: input.role,
      organizationId: input.organizationId,
    },
  });
}

export function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  return existing !== null;
}

/**
 * Minimal member directory for name/email-based participant resolution
 * (see modules/assistant/participant.resolver.ts). One query regardless
 * of how many names need resolving, rather than a lookup per name.
 */
export function listOrganizationMembers(organizationId: string) {
  return prisma.user.findMany({
    where: { organizationId },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
}
