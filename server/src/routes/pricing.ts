import { Router } from "express";
import { z } from "zod";

import { query } from "../lib/db.js";
import { requireAuth, requireAdmin, type AuthedRequest } from "../middleware/auth.js";

export const pricingRouter = Router();

pricingRouter.get("/pricing", async (_req, res, next) => {
  try {
    const rows = await query<{
      id: number;
      service_key: string;
      service_name: string;
      plan_key: string;
      plan_name: string;
      price_inr: number;
      is_active: boolean;
      sort_order: number;
    }>(
      "select id, service_key, service_name, plan_key, plan_name, price_inr, is_active, sort_order from services_pricing where is_active = true order by sort_order asc, service_key asc, price_inr asc"
    );

    return res.json({ ok: true, items: rows });
  } catch (err) {
    return next(err);
  }
});

const upsertSchema = z.object({
  serviceKey: z.string().min(1).max(80),
  serviceName: z.string().min(1).max(120),
  planKey: z.string().min(1).max(80),
  planName: z.string().min(1).max(120),
  priceInr: z.number().int().positive(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

pricingRouter.post("/admin/pricing", requireAuth, requireAdmin, async (req: AuthedRequest, res, next) => {
  try {
    const parsed = upsertSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    const d = parsed.data;
    const rows = await query<{ id: number }>(
      "insert into services_pricing (service_key, service_name, plan_key, plan_name, price_inr, is_active, sort_order) values ($1,$2,$3,$4,$5,coalesce($6,true),coalesce($7,0)) on conflict (service_key, plan_key) do update set service_name=excluded.service_name, plan_name=excluded.plan_name, price_inr=excluded.price_inr, is_active=excluded.is_active, sort_order=excluded.sort_order, updated_at=now() returning id",
      [d.serviceKey, d.serviceName, d.planKey, d.planName, d.priceInr, d.isActive ?? true, d.sortOrder ?? 0]
    );

    return res.json({ ok: true, id: rows[0]?.id });
  } catch (err) {
    return next(err);
  }
});

pricingRouter.get("/admin/pricing", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const rows = await query(
      "select id, service_key, service_name, plan_key, plan_name, price_inr, is_active, sort_order, created_at, updated_at from services_pricing order by sort_order asc, service_key asc, price_inr asc"
    );
    return res.json({ ok: true, items: rows });
  } catch (err) {
    return next(err);
  }
});
