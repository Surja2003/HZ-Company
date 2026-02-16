import type { NextFunction, Request, Response } from "express";

import { HttpError } from "./errorHandler.js";
import { getBearerToken, verifyToken, type AuthTokenPayload } from "../lib/auth.js";

export type AuthedRequest = Request & { user?: AuthTokenPayload };

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = getBearerToken(req);
  if (!token) return next(new HttpError(401, "Unauthorized", true));

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new HttpError(401, "Unauthorized", true));
  }
}

export function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, "Unauthorized", true));
  if (req.user.role !== "admin") return next(new HttpError(403, "Forbidden", true));
  return next();
}
