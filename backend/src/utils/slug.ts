export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Appends -2, -3, ... to a base slug until `isTaken` reports it's free.
 * `isTaken` is injected so this stays pure/testable and framework-agnostic —
 * the actual database lookup lives in the organization repository.
 */
export async function generateUniqueSlug(
  base: string,
  isTaken: (candidate: string) => Promise<boolean>
): Promise<string> {
  const root = slugify(base) || "organization";
  let candidate = root;
  let suffix = 2;

  while (await isTaken(candidate)) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
