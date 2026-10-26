import { randomUUID } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { signingRequests } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  isValidSignatureBox,
  type SignatureBox,
} from "@/lib/signing/signature-box";

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
    const rawBox = formData.get("signatureBox");

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

    if (bytes.subarray(0, 5).toString() !== "%PDF-") {
      return NextResponse.json(
        { error: "The uploaded file is not a valid PDF." },
        { status: 400 },
      );
    }

    let signatureBox: SignatureBox;

    try {
      const parsed: unknown = JSON.parse(String(rawBox ?? ""));
      if (!isValidSignatureBox(parsed)) {
        throw new Error("Invalid signature box.");
      }
      signatureBox = parsed;
    } catch {
      return NextResponse.json(
        { error: "Choose a valid signature location on the PDF." },
        { status: 400 },
      );
    }

    const document = await PDFDocument.load(bytes, {
      ignoreEncryption: false,
    });

    if (signatureBox.page >= document.getPageCount()) {
      return NextResponse.json(
        { error: "The selected signature page does not exist in this PDF." },
        { status: 400 },
      );
    }

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
        signatureBox,
        signerName: signerName || null,
        signerEmail: signerEmail || null,
        sourceDomain: "myhandymaninc",
        expiresAt,
      })
      .returning({ tokenNumber: signingRequests.tokenNumber });

    if (!created) {
      throw new Error("Signing request insert returned no row.");
    }

    return NextResponse.json({
      ok: true,
      tokenNumber: created.tokenNumber,
      link: `https://yourapplianceking.com/sign/${created.tokenNumber}`,
    });
  } catch (error) {
    console.error("Could not create signing request:", error);

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
