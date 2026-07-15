import { randomBytes, createHash } from "crypto";

/** A cryptographically random, URL-safe opaque token — this is what goes in the cookie. */
export function generateRefreshToken(): string {
  return randomBytes(64).toString("hex");
}

/**
 * We only ever store this hash in the database, never the raw token.
 * If the database is ever compromised, the stored values are useless
 * without the original token the client holds in its httpOnly cookie.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
