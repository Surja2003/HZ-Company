import { Router } from "express";
import { contactSchema } from "./schemas.js";
import { sanitizePlainText } from "../lib/sanitize.js";
import { query } from "../lib/db.js";
import { sendLeadEmail } from "../lib/email.js";
import { logger } from "../lib/logger.js";

export const contactRouter = Router();

contactRouter.post("/contact", async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    // Honeypot: silently accept.
    if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
      return res.json({ ok: true });
    }

    const name = sanitizePlainText(parsed.data.name);
    const email = sanitizePlainText(parsed.data.email);
    const phone = parsed.data.phone ? sanitizePlainText(parsed.data.phone) : null;
    const subject = sanitizePlainText(parsed.data.subject);
    const message = sanitizePlainText(parsed.data.message);

    const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.ip;
    const userAgent = req.get("user-agent") ?? null;
    const referer = req.get("referer") ?? null;

    await query(
      "insert into contact_submissions (name, email, phone, subject, message, ip, user_agent, referer) values ($1,$2,$3,$4,$5,$6,$7,$8)",
      [name, email, phone, subject, message, ip, userAgent, referer]
    );

    void sendLeadEmail({
      subject: `New contact: ${subject}`,
      text:
        `New Contact Submission\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        (phone ? `Phone: ${phone}\n` : "") +
        `Subject: ${subject}\n\n` +
        `Message:\n${message}\n\n` +
        `IP: ${ip}\n` +
        `UA: ${userAgent ?? ""}\n` +
        `Ref: ${referer ?? ""}\n`
    }).catch((err) => {
      logger.warn({ err }, "Failed to send contact lead email");
    });

    return res.json({ ok: true });
  } catch (e) {
    return next(e);
  }
});
