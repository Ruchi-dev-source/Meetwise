import { prisma } from "../../lib/prisma";
import type { Organization } from "@prisma/client";

export function createOrganization(name: string, slug: string): Promise<Organization> {
  return prisma.organization.create({ data: { name, slug } });
}

export function findOrganizationBySlug(slug: string): Promise<Organization | null> {
  return prisma.organization.findUnique({ where: { slug } });
}

export function findOrganizationById(id: string): Promise<Organization | null> {
  return prisma.organization.findUnique({ where: { id } });
}

export async function isSlugTaken(slug: string): Promise<boolean> {
  const existing = await prisma.organization.findUnique({ where: { slug }, select: { id: true } });
  return existing !== null;
}
