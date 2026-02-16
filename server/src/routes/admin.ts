import { Router } from "express";
import { z } from "zod";

import { query } from "../lib/db.js";
import { requireAuth, requireAdmin, type AuthedRequest } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.get("/admin/leads/contact", requireAuth, requireAdmin, async (_req: AuthedRequest, res, next) => {
  try {
    const rows = await query(
      "select id, created_at, name, email, phone, subject from contact_submissions order by created_at desc limit 200"
    );
    return res.json({ ok: true, items: rows });
  } catch (err) {
    return next(err);
  }
});

adminRouter.get("/admin/leads/hire", requireAuth, requireAdmin, async (_req: AuthedRequest, res, next) => {
  try {
    const rows = await query(
      "select id, created_at, name, email, phone, company, project_name, budget, timeline from hire_us_submissions order by created_at desc limit 200"
    );
    return res.json({ ok: true, items: rows });
  } catch (err) {
    return next(err);
  }
});

adminRouter.get("/admin/content", requireAuth, requireAdmin, async (_req: AuthedRequest, res, next) => {
  try {
    const rows = await query("select key, value, updated_at from site_content order by key asc");
    return res.json({ ok: true, items: rows });
  } catch (err) {
    return next(err);
  }
});

const upsertContentSchema = z.object({
  key: z.string().min(1).max(120),
  value: z.unknown()
});

adminRouter.put("/admin/content", requireAuth, requireAdmin, async (req: AuthedRequest, res, next) => {
  try {
    const parsed = upsertContentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    await query(
      "insert into site_content (key, value) values ($1,$2) on conflict (key) do update set value = excluded.value, updated_at = now()",
      [parsed.data.key, parsed.data.value]
    );

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});
