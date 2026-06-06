// lib/validators/lead.ts
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"), // ✅ Fixed: z.string().email()
  phone: z.string().min(1, "Phone number is required"),
  description: z.string().min(1, "Description is required"),
  notes: z.string().nullable().optional(),
  appointment: z.string().nullable().optional(),
  job_details: z.string().nullable().optional(),
  customer_notes: z.string().nullable().optional(),
  service: z.string().min(1, "Service is required"),
  customer_timeframe: z.string().nullable().optional(),
  status: z.string(),
  location: z.string().nullable().optional(),
});

export type CreateLeadInput = z.infer<typeof leadSchema>;
export const createLeadSchema = leadSchema;

export type Lead = CreateLeadInput & {
  id: number;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_LEAD_VALUES: CreateLeadInput = {
  name: "",
  email: "",
  phone: "",
  description: "",
  notes: null,
  location: null,
  appointment: null,
  job_details: null,
  customer_notes: null,
  service: "",
  customer_timeframe: null,
  status: "Potential",
};
