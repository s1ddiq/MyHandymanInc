import { z } from "zod";
import { createTRPCRouter, adminProcedure, staffProcedure } from "../init";
import { createLeadSchema } from "@/lib/validators/lead";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export const leadsRouter = createTRPCRouter({
  create: adminProcedure.input(createLeadSchema).mutation(async ({ input }) => {
    try {
      await db.insert(leads).values(input);
      // If we get here, it succeeded
      return {
        success: true,
      };
    } catch (error) {
      // Handle the error here
      console.error("Insert failed:", error);
      return {
        success: false,
      };
    }
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: createLeadSchema.partial(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db.update(leads).set(input.data).where(eq(leads.id, input.id));
        return {
          success: true,
        };
      } catch (error) {
        console.error("Update failed:", error);
        return {
          success: false,
        };
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(leads).where(eq(leads.id, input.id));
        return {
          success: true,
        };
      } catch (error) {
        console.error("Delete failed:", error);
        return {
          success: false,
        };
      }
    }),

  getPublic: staffProcedure.query(async () => {
    try {
      const leadsData = await db.select().from(leads);
      return leadsData;
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      return [];
    }
  }),
});
