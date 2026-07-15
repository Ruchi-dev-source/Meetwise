import { prisma } from "../../lib/prisma";
import type { RefreshToken } from "@prisma/client";

export function createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
  return prisma.refreshToken.create({
    data: { userId, token: tokenHash, expiresAt },
  });
}

export function findRefreshTokenByHash(tokenHash: string) {
  return prisma.refreshToken.findUnique({
    where: { token: tokenHash },
    include: { user: true },
  });
}

export function deleteRefreshTokenById(id: string): Promise<RefreshToken> {
  return prisma.refreshToken.delete({ where: { id } });
}

/** Called on login to enforce "one active session" per the spec. */
export function deleteAllRefreshTokensForUser(userId: string) {
  return prisma.refreshToken.deleteMany({ where: { userId } });
}
