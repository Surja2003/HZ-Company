import { createApp } from "./app.js";
import { env } from "./lib/env.js";
import { logger } from "./lib/logger.js";
import { initDb } from "./lib/db.js";

function isAddrInUseError(err: unknown) {
  const anyErr = err as any;
  return anyErr?.code === "EADDRINUSE";
}

async function listenWithFallback(app: ReturnType<typeof createApp>, startPort: number) {
  // Keep the retry window small and predictable.
  const maxAttempts = 20;

  for (let attempt = 0; attempt <= maxAttempts; attempt++) {
    const port = startPort + attempt;

    try {
      const server = await new Promise<import("node:http").Server>((resolve, reject) => {
        const s = app.listen(port, () => resolve(s));
        s.on("error", reject);
      });

      return { server, port };
    } catch (err) {
      if (isAddrInUseError(err) && attempt < maxAttempts) {
        logger.warn({ port }, "Port in use, trying next port");
        continue;
      }
      throw err;
    }
  }

  throw new Error("No available port found");
}

async function main() {
  await initDb();

  const app = createApp();

  const startPort = env.PORT ?? 8080;
  const { port } = await listenWithFallback(app, startPort);
  logger.info({ port, env: env.NODE_ENV }, "API server listening");
}

main().catch((err) => {
  logger.fatal({ err }, "Failed to start API server");
  process.exit(1);
});
