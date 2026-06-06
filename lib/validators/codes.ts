import { accessCodes } from "@/db/schema";

export type AccessCode = typeof accessCodes.$inferSelect;
export type NewAccessCode = typeof accessCodes.$inferInsert;
