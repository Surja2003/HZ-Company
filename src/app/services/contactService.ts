import { postJson } from "./apiClient";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  honeypot?: string;
};

export type HireUsPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  services: string[];
  projectName: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  referenceUrl?: string;
  additionalNotes?: string;
  honeypot?: string;
};

export async function submitContact(payload: ContactPayload) {
  // Backend contract placeholder: adjust path/shape when API is ready.
  return postJson<ContactPayload, { ok: true }>("/api/contact", payload);
}

export async function submitHireUs(payload: HireUsPayload) {
  return postJson<HireUsPayload, { ok: true }>("/api/hire-us", payload);
}
