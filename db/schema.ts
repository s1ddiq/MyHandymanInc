import {
  bigint,
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
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

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Clerk user ID
  senderId: text("sender_id").notNull(),

  content: text("content"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatAttachments = pgTable("chat_attachments", {
  id: uuid("id").defaultRandom().primaryKey(),

  messageId: uuid("message_id")
    .notNull()
    .references(() => chatMessages.id, {
      onDelete: "cascade",
    }),

  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type"),
  fileSize: bigint("file_size", { mode: "number" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessageReads = pgTable("chat_message_reads", {
  id: uuid("id").defaultRandom().primaryKey(),

  messageId: uuid("message_id")
    .notNull()
    .references(() => chatMessages.id, {
      onDelete: "cascade",
    }),

  // Clerk user ID
  userId: text("user_id").notNull(),

  readAt: timestamp("read_at").defaultNow().notNull(),
});
