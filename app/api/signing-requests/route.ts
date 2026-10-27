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
const UUID_PDF_PATH =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.pdf$/i;

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function removeStoredPdf(path: string) {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error("Could not remove signing PDF:", error.message);
  }
}

export async function POST(request: Request) {
  let cleanupPath: string | undefined;

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request must contain valid JSON." },
        { status: 400 },
      );
    }

    if (!isJsonObject(body)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (body.action === "prepare") {
      const fileName =
        typeof body.fileName === "string" ? body.fileName.trim() : "";
      const fileSize = body.fileSize;
      const contentType =
        typeof body.contentType === "string" ? body.contentType : "";

      if (
        !fileName.toLowerCase().endsWith(".pdf") ||
        contentType !== "application/pdf"
      ) {
        return NextResponse.json(
          { error: "The uploaded file must be a PDF." },
          { status: 400 },
        );
      }

      if (
        typeof fileSize !== "number" ||
        !Number.isSafeInteger(fileSize) ||
        fileSize <= 0
      ) {
        return NextResponse.json(
          { error: "The PDF file size is invalid." },
          { status: 400 },
        );
      }

      if (fileSize > MAX_PDF_BYTES) {
        return NextResponse.json(
          { error: "PDF must be 20 MB or smaller." },
          { status: 400 },
        );
      }

      const pdfPath = `${randomUUID()}.pdf`;
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUploadUrl(pdfPath);

      if (error || !data) {
        console.error("Could not create signed upload URL:", error?.message);
        return NextResponse.json(
          { error: "Could not prepare the PDF upload." },
          { status: 502 },
        );
      }

      return NextResponse.json({
        ok: true,
        pdfPath,
        token: data.token,
      });
    }

    if (body.action !== "complete") {
      return NextResponse.json(
        { error: "Unknown upload action." },
        { status: 400 },
      );
    }

    const pdfPath = typeof body.pdfPath === "string" ? body.pdfPath : "";

    if (!UUID_PDF_PATH.test(pdfPath)) {
      return NextResponse.json(
        { error: "The PDF upload path is invalid." },
        { status: 400 },
      );
    }

    cleanupPath = pdfPath;

    const pdfFileName =
      typeof body.pdfFileName === "string" ? body.pdfFileName.trim() : "";
    const signerName =
      typeof body.signerName === "string" ? body.signerName.trim() : "";
    const signerEmail =
      typeof body.signerEmail === "string" ? body.signerEmail.trim() : "";

    if (!pdfFileName.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "The uploaded file must be a PDF." },
        { status: 400 },
      );
    }

    if (!isValidSignatureBox(body.signatureBox)) {
      return NextResponse.json(
        { error: "Choose a valid signature location on the PDF." },
        { status: 400 },
      );
    }

    const signatureBox: SignatureBox = body.signatureBox;

    const { data: storedPdf, error: downloadError } =
      await supabaseAdmin.storage.from(BUCKET).download(pdfPath);

    if (downloadError || !storedPdf) {
      console.error("Could not read uploaded PDF:", downloadError?.message);
      return NextResponse.json(
        {
          error: "The uploaded PDF could not be found. Please upload it again.",
        },
        { status: 400 },
      );
    }

    if (storedPdf.size === 0 || storedPdf.size > MAX_PDF_BYTES) {
      await removeStoredPdf(pdfPath);
      cleanupPath = undefined;

      return NextResponse.json(
        { error: "PDF must be non-empty and 20 MB or smaller." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await storedPdf.arrayBuffer());

    if (bytes.subarray(0, 5).toString() !== "%PDF-") {
      await removeStoredPdf(pdfPath);
      cleanupPath = undefined;

      return NextResponse.json(
        { error: "The uploaded file is not a valid PDF." },
        { status: 400 },
      );
    }

    let pageCount: number;

    try {
      const document = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
      });
      pageCount = document.getPageCount();
    } catch {
      await removeStoredPdf(pdfPath);
      cleanupPath = undefined;

      return NextResponse.json(
        {
          error: "The PDF could not be opened. It may be encrypted or damaged.",
        },
        { status: 400 },
      );
    }

    if (signatureBox.page >= pageCount) {
      return NextResponse.json(
        { error: "The selected signature page does not exist in this PDF." },
        { status: 400 },
      );
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [created] = await db
      .insert(signingRequests)
      .values({
        pdfPath,
        pdfFileName: pdfFileName.slice(0, 255),
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

    cleanupPath = undefined;

    return NextResponse.json({
      ok: true,
      tokenNumber: created.tokenNumber,
      link: `https://yourapplianceking.com/sign/${created.tokenNumber}`,
    });
  } catch (error) {
    console.error("Could not create signing request:", error);

    if (cleanupPath) {
      await removeStoredPdf(cleanupPath);
    }

    return NextResponse.json(
      { error: "Could not create signing request." },
      { status: 500 },
    );
  }
}
