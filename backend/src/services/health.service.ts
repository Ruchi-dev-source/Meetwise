import { prisma } from "../config/db";

export async function checkDatabaseConnection(): Promise<{ connected: boolean; latencyMs: number }> {
  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  return { connected: true, latencyMs: Date.now() - start };
}
