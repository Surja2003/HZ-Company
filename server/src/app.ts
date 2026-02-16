import express from "express";
import helmet from "helmet";
import cors from "cors";

import { env } from "./lib/env.js";
import { apiRateLimit } from "./middleware/rateLimit.js";
import { requestLogger } from "./middleware/requestContext.js";
import { errorHandler, HttpError, notFound } from "./middleware/errorHandler.js";
import { contactRouter } from "./routes/contact.js";
import { hireUsRouter } from "./routes/hireUs.js";

export function createApp() {
  const app = express();

  // Trust proxy when running behind a CDN / load balancer.
  app.set("trust proxy", 1);

  app.use(requestLogger);

  app.use(
    helmet({
      // Keep defaults; adjust CSP only after you finalize analytics scripts.
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (env.CORS_ORIGINS.includes(origin)) return callback(null, true);
        return callback(new HttpError(403, "Not allowed by CORS", true));
      },
      credentials: false,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      maxAge: 600
    })
  );

  app.use(express.json({ limit: "200kb" }));

  // Rate limit all API routes.
  app.use("/api", apiRateLimit);

  // Health check
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Form endpoints
  app.use("/api", contactRouter);
  app.use("/api", hireUsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
