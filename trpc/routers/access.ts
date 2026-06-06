// server/api/routers/access-code.ts
import { z } from "zod";
import { eq, and, isNull, or, gt } from "drizzle-orm";
import { accessCodes } from "@/db/schema";
import { createTRPCRouter, publicProcedure } from "../init";

export const accessCodeRouter = createTRPCRouter({
  validate: publicProcedure
    .input(z.object({ code: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const { code } = input;
      const { db } = ctx;

      // Find valid access code using explicit select().where()
      const [validCode] = await db
        .select()
        .from(accessCodes)
        .where(
          and(
            eq(accessCodes.code, code),
            eq(accessCodes.isActive, true),
            or(
              isNull(accessCodes.usedAt),
              isNull(accessCodes.expiresAt),
              gt(accessCodes.expiresAt, new Date()),
            ),
          ),
        )
        .limit(1);

      if (!validCode) {
        return { valid: false, error: "Invalid or expired access code" };
      }

      // Optional: Mark code as used
      await db
        .update(accessCodes)
        .set({
          usedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(accessCodes.id, validCode.id));

      return { valid: true };
    }),

  checkIfUsed: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const { code } = input;

      // Using explicit select().where() for consistency
      const [existingCode] = await ctx.db
        .select()
        .from(accessCodes)
        .where(eq(accessCodes.code, code))
        .limit(1);

      return { isUsed: !!existingCode?.usedAt };
    }),

  // Optional: Get all valid access codes (admin only - add auth middleware)
  getAllValidCodes: publicProcedure.query(async ({ ctx }) => {
    const validCodes = await ctx.db
      .select({
        id: accessCodes.id,
        code: accessCodes.code,
        usedAt: accessCodes.usedAt,
        expiresAt: accessCodes.expiresAt,
        isActive: accessCodes.isActive,
      })
      .from(accessCodes)
      .where(
        and(
          eq(accessCodes.isActive, true),
          or(
            isNull(accessCodes.usedAt),
            isNull(accessCodes.expiresAt),
            gt(accessCodes.expiresAt, new Date()),
          ),
        ),
      )
      .orderBy(accessCodes.createdAt);

    return { codes: validCodes };
  }),
});
