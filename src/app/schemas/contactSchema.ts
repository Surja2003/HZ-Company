import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Please select a subject"),
  message: z.string().trim().min(10, "Please add a bit more detail"),
  companyWebsite: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
