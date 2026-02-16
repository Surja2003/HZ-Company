import { env } from "../env.js";

function normalizeIndianMobile(phone: string) {
  const raw = phone.replace(/\s+/g, "").replace(/-/g, "");
  const digits = raw.replace(/^\+/, "");

  // Accept: 10-digit, 91xxxxxxxxxx, +91xxxxxxxxxx
  if (/^\d{10}$/.test(digits)) return { e164: `+91${digits}`, national: digits };
  if (/^91\d{10}$/.test(digits)) return { e164: `+${digits}`, national: digits.slice(2) };

  throw new Error("Invalid Indian mobile number");
}

export async function sendOtpSmsMsg91(input: { phone: string; otp: string }) {
  if (!env.MSG91_AUTH_KEY) {
    throw new Error("MSG91 is not configured (MSG91_AUTH_KEY missing)");
  }

  const { national } = normalizeIndianMobile(input.phone);

  // MSG91 OTP API (shape can vary by account/template setup). Keep this isolated in one adapter.
  const res = await fetch("https://api.msg91.com/api/v5/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authkey: env.MSG91_AUTH_KEY
    },
    body: JSON.stringify({
      mobile: `91${national}`,
      otp: input.otp,
      template_id: env.MSG91_TEMPLATE_ID
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MSG91 request failed (${res.status}): ${text}`);
  }
}

export function normalizeIndianPhoneE164(phone: string) {
  return normalizeIndianMobile(phone).e164;
}
