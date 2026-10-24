import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { signingRequests } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_PDF_BYTES = 20 * 1024 * 1024;
const BUCKET = "signing-documents";

export async function POST(request: Request) {
  let pdfPath: string | undefined;

  try {
    const formData = await request.formData();
    const pdf = formData.get("pdf");
    const signerName = String(formData.get("signerName") ?? "").trim();
    const signerEmail = String(formData.get("signerEmail") ?? "").trim();

    if (!(pdf instanceof File) || pdf.size === 0) {
      return NextResponse.json(
        { error: "Choose a PDF to upload." },
        { status: 400 },
      );
    }

    if (
      pdf.type !== "application/pdf" ||
      !pdf.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "The uploaded file must be a PDF." },
        { status: 400 },
      );
    }

    if (pdf.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: "PDF must be 20 MB or smaller." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await pdf.arrayBuffer());

    // Basic PDF signature check; the browser-supplied MIME type alone isn't enough.
    if (bytes.subarray(0, 5).toString() !== "%PDF-") {
      return NextResponse.json(
        { error: "The uploaded file is not a valid PDF." },
        { status: 400 },
      );
    }

    // Use an unguessable storage path even though the displayed link number is sequential.
    pdfPath = `${randomUUID()}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(pdfPath, bytes, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Signing PDF upload failed:", uploadError.message);
      return NextResponse.json(
        { error: "Could not upload the PDF." },
        { status: 502 },
      );
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [created] = await db
      .insert(signingRequests)
      .values({
        pdfPath,
        pdfFileName: pdf.name.slice(0, 255),
        signerName: signerName || null,
        signerEmail: signerEmail || null,
        sourceDomain: "myhandymaninc",
        expiresAt,
      })
      .returning({ tokenNumber: signingRequests.tokenNumber });

    if (!created) {
      throw new Error("Signing request insert returned no row.");
    }

    const link = `https://yourapplianceking.com/sign/${created.tokenNumber}`;

    return NextResponse.json({
      ok: true,
      tokenNumber: created.tokenNumber,
      link,
    });
  } catch (error) {
    console.error("Could not create signing request:", error);

    // Clean up uploaded file if the database insert failed.
    if (pdfPath) {
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([pdfPath])
        .catch(() => undefined);
    }

    return NextResponse.json(
      { error: "Could not create signing request." },
      { status: 500 },
    );
  }
}
