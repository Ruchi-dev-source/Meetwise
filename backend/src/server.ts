import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { createApp } from "./app";

async function main() {
  // Fail fast if the database isn't reachable, rather than starting the
  // HTTP server and only discovering it on the first request.
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL");

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 MeetWise API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  async function shutdown(signal: string) {
    console.log(`\n${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("✅ Server closed, database disconnected");
      process.exit(0);
    });

    // Force-exit if shutdown hangs for some reason.
    setTimeout(() => process.exit(1), 10_000).unref();
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("❌ Failed to start MeetWise API:", err);
  process.exit(1);
});
