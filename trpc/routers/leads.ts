import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  staffProcedure,
  salesRepProcedure,
} from "../init";
import { createLeadSchema } from "@/lib/validators/lead";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { getCurrentRole } from "@/lib/utils/roles";

export const leadsRouter = createTRPCRouter({
  create: staffProcedure.input(createLeadSchema).mutation(async ({ input }) => {
    try {
      await db.insert(leads).values(input);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Insert failed:", error);
      return {
        success: false,
      };
    }
  }),

  update: staffProcedure
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

  // Updated submit procedure to include job_details
  submit: salesRepProcedure
    .input(
      z.object({
        id: z.number(),
        notes: z.string().optional(),
        appointment: z.string().optional(),
        job_details: z.string().optional(), // ADD THIS
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db
          .update(leads)
          .set({
            notes: input.notes,
            appointment: input.appointment,
            job_details: input.job_details, // ADD THIS
            status: "Submitted",
          })
          .where(eq(leads.id, input.id));

        return {
          success: true,
        };
      } catch (error) {
        console.error("Submit failed:", error);
        return {
          success: false,
        };
      }
    }),

  delete: staffProcedure
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
    const role = await getCurrentRole();

    try {
      if (role === "sales_rep") {
        // Show leads that are NOT "Submitted"
        const leadsData = await db
          .select()
          .from(leads)
          .where(ne(leads.status, "Submitted"));
        return leadsData;
      }
      // For staff/admin, show all leads
      const leadsData = await db.select().from(leads);
      return leadsData;
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      return [];
    }
  }),
});
