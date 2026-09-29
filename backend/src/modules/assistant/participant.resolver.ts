import { usersRepository } from "../users";

export interface ParticipantResolution {
  resolvedIds: string[];
  unresolvedNames: string[];
}

/**
 * Resolves free-text participant names/emails to user ids within the
 * caller's own organization. Supports exact email, exact full name, and
 * an unambiguous first-name match; anything else (including group names
 * like "the QA team" — there's no team concept in the schema) is
 * reported back as unresolved rather than guessed at.
 */
export async function resolveParticipants(names: string[], organizationId: string): Promise<ParticipantResolution> {
  if (names.length === 0) return { resolvedIds: [], unresolvedNames: [] };

  const members = await usersRepository.listOrganizationMembers(organizationId);
  const resolvedIds: string[] = [];
  const unresolvedNames: string[] = [];

  for (const rawName of names) {
    const name = rawName.trim();
    if (!name) continue;
    const lower = name.toLowerCase();

    const byEmail = members.find((m: { email: string }) => m.email.toLowerCase() === lower);
    if (byEmail) {
      resolvedIds.push(byEmail.id);
      continue;
    }

    const byFullName = members.find(
      (m: { firstName: string; lastName: string }) => `${m.firstName} ${m.lastName}`.toLowerCase() === lower
    );
    if (byFullName) {
      resolvedIds.push(byFullName.id);
      continue;
    }

    const byFirstName = members.filter((m: { firstName: string }) => m.firstName.toLowerCase() === lower);
    if (byFirstName.length === 1) {
      resolvedIds.push(byFirstName[0].id);
      continue;
    }

    unresolvedNames.push(rawName);
  }

  return { resolvedIds: [...new Set(resolvedIds)], unresolvedNames };
}
