import type { Organization } from "@prisma/client";

export type { Organization };

export interface CreateOrganizationInput {
  name: string;
}
