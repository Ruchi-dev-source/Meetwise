import type { Organization } from "@prisma/client";
import * as organizationRepository from "./organization.repository";
import { generateUniqueSlug } from "../../utils/slug";
import type { CreateOrganizationInput } from "./organization.types";

export async function createOrganizationWithUniqueSlug(
  input: CreateOrganizationInput
): Promise<Organization> {
  const slug = await generateUniqueSlug(input.name, organizationRepository.isSlugTaken);
  return organizationRepository.createOrganization(input.name, slug);
}
