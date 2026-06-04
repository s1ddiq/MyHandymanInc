import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  notes: text("notes"),
  appointment: text("appointment"),
  job_details: text("job_details"),
  location: text("location"),
  customer_notes: text("customer_notes"),
  service: text("service").notNull(),
  customer_timeframe: text("customer_timeframe"),
  contact_status: text("contact_status")
    .notNull()
    .default("Selected Show Number"),
  status: text("status").notNull().default("Potential"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
