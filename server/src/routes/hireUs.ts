import { Router } from "express";
import { hireUsSchema } from "./schemas.js";
import { sanitizePlainText } from "../lib/sanitize.js";
import { query } from "../lib/db.js";
import { sendLeadEmail } from "../lib/email.js";
import { logger } from "../lib/logger.js";

export const hireUsRouter = Router();

hireUsRouter.post("/hire-us", async (req, res, next) => {
  try {
    const parsed = hireUsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid request", details: parsed.error.flatten() });
    }

    // Honeypot: silently accept.
    if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
      return res.json({ ok: true });
    }

    const name = sanitizePlainText(parsed.data.name);
    const email = sanitizePlainText(parsed.data.email);
    const phone = sanitizePlainText(parsed.data.phone);
    const company = parsed.data.company ? sanitizePlainText(parsed.data.company) : null;

    const services = parsed.data.services.map(sanitizePlainText);
    const projectName = sanitizePlainText(parsed.data.projectName);
    const projectDescription = sanitizePlainText(parsed.data.projectDescription);
    const budget = sanitizePlainText(parsed.data.budget);
    const timeline = sanitizePlainText(parsed.data.timeline);
    const referenceUrl = parsed.data.referenceUrl ? sanitizePlainText(parsed.data.referenceUrl) : null;
    const additionalNotes = parsed.data.additionalNotes ? sanitizePlainText(parsed.data.additionalNotes) : null;

    const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.ip;
    const userAgent = req.get("user-agent") ?? null;
    const referer = req.get("referer") ?? null;

    await query(
      "insert into hire_us_submissions (name, email, phone, company, services, project_name, project_description, budget, timeline, reference_url, additional_notes, ip, user_agent, referer) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
      [
        name,
        email,
        phone,
        company,
        services,
        projectName,
        projectDescription,
        budget,
        timeline,
        referenceUrl,
        additionalNotes,
        ip,
        userAgent,
        referer
      ]
    );

    void sendLeadEmail({
      subject: `New Hire Us request: ${projectName}`,
      text:
        `New Hire Us Submission\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        (company ? `Company: ${company}\n` : "") +
        `Services: ${services.join(", ")}\n` +
        `Budget: ${budget}\n` +
        `Timeline: ${timeline}\n` +
        (referenceUrl ? `Reference: ${referenceUrl}\n` : "") +
        `\nProject:\n${projectDescription}\n\n` +
        (additionalNotes ? `Notes:\n${additionalNotes}\n\n` : "") +
        `IP: ${ip}\n` +
        `UA: ${userAgent ?? ""}\n` +
        `Ref: ${referer ?? ""}\n`
    }).catch((err) => {
      logger.warn({ err }, "Failed to send hire-us lead email");
    });

    return res.json({ ok: true });
  } catch (e) {
    return next(e);
  }
});
