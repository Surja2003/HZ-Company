import { Router } from "express";
import { z } from "zod";

import { query } from "../lib/db.js";
import { HttpError } from "../middleware/errorHandler.js";
import { hashPassword, signToken, verifyPassword } from "../lib/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  password: z.string().min(8).max(200)
});

authRouter.post("/auth/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const rows = await query<{ id: number; name: string; email: string }>(
      "insert into clients (name, email, password_hash) values ($1,$2,$3) on conflict (email) do update set name = excluded.name returning id, name, email",
      [parsed.data.name, parsed.data.email.toLowerCase(), passwordHash]
    );

    const client = rows[0];
    if (!client) throw new HttpError(500, "Failed to create client");

    const token = signToken({ sub: String(client.id), email: client.email, role: "client", name: client.name });
    return res.json({ ok: true, token, role: "client" });
  } catch (err) {
    return next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200)
});

authRouter.post("/auth/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    const email = parsed.data.email.toLowerCase();

    // Admin: email allowlist table.
    const adminRows = await query<{ id: number; email: string; name: string | null; is_active: boolean }>(
      "select id, email, name, is_active from admin_users where email = $1 limit 1",
      [email]
    );

    if (adminRows[0]?.is_active) {
      // Admin auth: still requires a password. For simplicity, reuse client password table by requiring an existing client.
      const clientRows = await query<{ id: number; password_hash: string; name: string }>(
        "select id, password_hash, name from clients where email = $1 limit 1",
        [email]
      );
      const client = clientRows[0];
      if (!client) throw new HttpError(401, "Invalid credentials", true);

      const ok = await verifyPassword(parsed.data.password, client.password_hash);
      if (!ok) throw new HttpError(401, "Invalid credentials", true);

      const token = signToken({ sub: String(adminRows[0].id), email, role: "admin", name: adminRows[0].name ?? client.name });
      return res.json({ ok: true, token, role: "admin" });
    }

    const rows = await query<{ id: number; name: string; email: string; password_hash: string }>(
      "select id, name, email, password_hash from clients where email = $1 limit 1",
      [email]
    );

    const client = rows[0];
    if (!client) throw new HttpError(401, "Invalid credentials", true);

    const ok = await verifyPassword(parsed.data.password, client.password_hash);
    if (!ok) throw new HttpError(401, "Invalid credentials", true);

    const token = signToken({ sub: String(client.id), email: client.email, role: "client", name: client.name });
    return res.json({ ok: true, token, role: "client" });
  } catch (err) {
    return next(err);
  }
});
