import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().min(3).max(140),
  message: z.string().min(10).max(5000),
  honeypot: z.string().optional()
});

export const hireUsSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phone: z.string().min(7).max(40),
  company: z.string().max(140).optional(),
  services: z.array(z.string().min(1)).min(1).max(20),
  projectName: z.string().min(2).max(140),
  projectDescription: z.string().min(10).max(8000),
  budget: z.string().min(1).max(50),
  timeline: z.string().min(1).max(50),
  referenceUrl: z.string().url().optional(),
  additionalNotes: z.string().max(8000).optional(),
  honeypot: z.string().optional()
});
