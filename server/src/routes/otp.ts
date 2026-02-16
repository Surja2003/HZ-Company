import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import { env } from "../lib/env.js";
import { query } from "../lib/db.js";
import { generateOtp6, makeOtpHash, randomSalt } from "../lib/otp.js";
import { normalizeIndianPhoneE164, sendOtpSmsMsg91 } from "../lib/sms/msg91.js";
import { HttpError } from "../middleware/errorHandler.js";
import { signToken } from "../lib/auth.js";

export const otpRouter = Router();

// Stricter rate limit for OTP routes.
otpRouter.use(
  rateLimit({
    windowMs: 10 * 60_000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false
  })
);

const requestSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    email: z.string().email().max(254).optional(),
    phone: z.string().min(8).max(20)
  })
  .strict();

otpRouter.post("/request", async (req, res, next) => {
  try {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    const phoneE164 = normalizeIndianPhoneE164(parsed.data.phone);
    const email = parsed.data.email?.toLowerCase();

    // Create/find user (phone-first, fallback to email).
    let userId: number | undefined;

    const byPhone = await query<{ id: number }>("select id from users where phone = $1 limit 1", [phoneE164]);
    userId = byPhone[0]?.id;

    if (!userId && email) {
      const byEmail = await query<{ id: number }>("select id from users where email = $1 limit 1", [email]);
      userId = byEmail[0]?.id;

      if (userId) {
        // attach phone if missing
        await query("update users set phone = coalesce(phone, $1) where id = $2", [phoneE164, userId]);
      }
    }

    if (!userId) {
      const name = parsed.data.name ?? "User";
      if (!email) throw new HttpError(400, "Email is required for first-time OTP", true);

      const created = await query<{ id: number }>(
        "insert into users (name, email, phone, is_verified) values ($1,$2,$3,false) returning id",
        [name, email, phoneE164]
      );
      userId = created[0]?.id;
    }

    if (!userId) throw new HttpError(500, "Failed to create user");

    const otp = generateOtp6();
    const salt = randomSalt(16);
    const otpHash = makeOtpHash(otp, salt);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRES_SECONDS * 1000);

    await query(
      "insert into otp_codes (user_id, otp_hash, otp_salt, expires_at) values ($1,$2,$3,$4)",
      [userId, otpHash, salt, expiresAt.toISOString()]
    );

    // For local testing only: skip provider call and return OTP.
    if (env.NODE_ENV !== "production" && env.OTP_DEBUG_RETURN) {
      return res.json({ ok: true, debugOtp: otp, expiresInSeconds: env.OTP_EXPIRES_SECONDS });
    }

    await sendOtpSmsMsg91({ phone: phoneE164, otp });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

const verifySchema = z
  .object({
    phone: z.string().min(8).max(20),
    otp: z.string().regex(/^\d{6}$/)
  })
  .strict();

otpRouter.post("/verify", async (req, res, next) => {
  try {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    const phoneE164 = normalizeIndianPhoneE164(parsed.data.phone);

    const userRows = await query<{ id: number; email: string; name: string; is_verified: boolean }>(
      "select id, email, name, is_verified from users where phone = $1 limit 1",
      [phoneE164]
    );

    const user = userRows[0];
    if (!user) throw new HttpError(404, "User not found", true);

    const codeRows = await query<{ id: number; otp_hash: string; otp_salt: string; expires_at: string; consumed_at: string | null }>(
      "select id, otp_hash, otp_salt, expires_at, consumed_at from otp_codes where user_id = $1 order by created_at desc limit 1",
      [user.id]
    );

    const code = codeRows[0];
    if (!code) throw new HttpError(400, "OTP not requested", true);
    if (code.consumed_at) throw new HttpError(400, "OTP already used", true);

    const expiresAtMs = new Date(code.expires_at).getTime();
    if (!Number.isFinite(expiresAtMs) || Date.now() > expiresAtMs) {
      throw new HttpError(400, "OTP expired", true);
    }

    const expected = makeOtpHash(parsed.data.otp, code.otp_salt);
    if (expected !== code.otp_hash) throw new HttpError(400, "Invalid OTP", true);

    await query("update otp_codes set consumed_at = now() where id = $1", [code.id]);
    await query("update users set is_verified = true where id = $1", [user.id]);

    const token = signToken({ sub: String(user.id), email: user.email, role: "client", name: user.name });

    return res.json({ ok: true, token, isVerified: true });
  } catch (err) {
    return next(err);
  }
});
