import { PrismaClient } from "@prisma/client";
import { isProduction } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Reuse a single PrismaClient across hot-reloads in dev so we don't
// exhaust the Postgres connection pool every time tsx watch restarts.
export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: isProduction ? ["error", "warn"] : ["error", "warn"],
  });

if (!isProduction) {
  global.__prisma = prisma;
}
