import { and, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { signingRequests } from "@/db/schema";
import { adminProcedure, createTRPCRouter } from "../init";

export const signingRequestsRouter = createTRPCRouter({
  getRecentSigned: adminProcedure
    .input(
      z.object({
        search: z.string().trim().max(200).default(""),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const search = input.search;

      const searchCondition = search
        ? or(
            ilike(signingRequests.signerName, `%${search}%`),
            ilike(signingRequests.signerEmail, `%${search}%`),
          )
        : undefined;

      const rows = await ctx.db
        .select({
          tokenNumber: signingRequests.tokenNumber,
          signerName: signingRequests.signerName,
          signerEmail: signingRequests.signerEmail,
          pdfFileName: signingRequests.pdfFileName,
          signedAt: signingRequests.signedAt,
          signedPdfPath: signingRequests.signedPdfPath,
        })
        .from(signingRequests)
        .where(
          searchCondition
            ? and(eq(signingRequests.status, "signed"), searchCondition)
            : eq(signingRequests.status, "signed"),
        )
        .orderBy(desc(signingRequests.signedAt))
        .limit(6)
        .offset(input.offset);

      return {
        requests: rows.slice(0, 5).map((row) => ({
          tokenNumber: row.tokenNumber,
          signerName: row.signerName,
          signerEmail: row.signerEmail,
          pdfFileName: row.pdfFileName,
          signedAt: row.signedAt,
          hasSignedPdf: Boolean(row.signedPdfPath),
        })),
        hasMore: rows.length > 5,
        nextOffset: input.offset + 5,
      };
    }),
});
