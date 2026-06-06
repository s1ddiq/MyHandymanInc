import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

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
  // contact_status: text("contact_status")
  //   .notNull()
  //   .default("Needs Call"),
  status: text("status").notNull().default("Potential"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const accessCodes = pgTable("access_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
