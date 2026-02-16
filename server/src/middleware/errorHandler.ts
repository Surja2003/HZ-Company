import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";

export class HttpError extends Error {
  status: number;
  expose: boolean;
  constructor(status: number, message: string, expose = false) {
    super(message);
    this.status = status;
    this.expose = expose;
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, "Not found", true));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isProd = process.env.NODE_ENV === "production";

  if (err instanceof HttpError) {
    if (!isProd || err.expose) {
      return res.status(err.status).json({ ok: false, error: err.message });
    }
    return res.status(err.status).json({ ok: false, error: "Request failed" });
  }

  const message = err instanceof Error ? err.message : String(err);
  logger.error({ err, message }, "Unhandled error");

  if (!isProd) {
    return res.status(500).json({ ok: false, error: message });
  }

  return res.status(500).json({ ok: false, error: "Internal server error" });
}
