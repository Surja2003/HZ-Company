import { env } from "./env.js";
import { Resend } from "resend";

export type LeadEmail = {
  subject: string;
  text: string;
};

const isEnabled = Boolean(env.RESEND_API_KEY && env.MAIL_FROM && env.MAIL_TO);
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export function isEmailEnabled() {
  return isEnabled;
}

export async function sendLeadEmail(message: LeadEmail) {
  if (!isEnabled || !resend) return;

  await resend.emails.send({
    from: env.MAIL_FROM!,
    to: env.MAIL_TO!,
    subject: message.subject,
    text: message.text
  });
}
