import { randomUUID } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { db } from "@/db";
import { signingRequests } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  isValidSignatureBox,
  type SignatureBox,
} from "@/lib/signing/signature-box";

export const runtime = "nodejs";

const BUCKET = "signing-documents";
const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function decodeSignatureData(dataUrl: string) {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
  if (!match) return null;

  const bytes = Buffer.from(match[1], "base64");
  if (bytes.length === 0 || bytes.length > 1_500_000) return null;
  return bytes;
}

async function emailSigningNotice(details: {
  signerName: string | null;
  signerEmail: string | null;
  pdfFileName: string | null;
  signedPdfBytes: Uint8Array;
}) {
  const from = process.env.CONTACT_EMAIL_FROM;

  if (!process.env.RESEND_API_KEY || !from) {
    throw new Error("RESEND_API_KEY or CONTACT_EMAIL_FROM is missing.");
  }

  const name = details.signerName?.trim() || "Not provided";
  const email = details.signerEmail?.trim() || "Not provided";
  const fileName = details.pdfFileName?.trim() || "signed-document.pdf";
  const attachmentName = `signed-${fileName.replace(/[\\/:*?"<>|]/g, "_")}`;

  const { error } = await resend.emails.send({
    from,
    to: ["myhandymaninc1@gmail.com", "snashct@gmail.com"],
    subject: `Signed document ready: ${fileName}`,
    text: [
      "A signing request has been completed.",
      "",
      `Signer: ${name}`,
      `Signer email: ${email}`,
      `Document: ${fileName}`,
      "The completed signed PDF is attached.",
    ].join("\n"),
    html: `
      <h2>Signed document ready</h2>
      <p>A signing request has been completed.</p>
      <ul>
        <li><strong>Signer:</strong> ${escapeHtml(name)}</li>
        <li><strong>Signer email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Document:</strong> ${escapeHtml(fileName)}</li>
      </ul>
      <p>The completed signed PDF is attached.</p>
    `,
    attachments: [
      {
        filename: attachmentName,
        content: Buffer.from(details.signedPdfBytes).toString("base64"),
      },
    ],
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tokenNumber: string }> },
) {
  const { tokenNumber: rawNumber } = await params;

  if (!/^[1-9]\d*$/.test(rawNumber)) {
    return NextResponse.json(
      { error: "Signing link is invalid." },
      { status: 404 },
    );
  }

  const tokenNumber = Number(rawNumber);

  if (!Number.isSafeInteger(tokenNumber)) {
    return NextResponse.json(
      { error: "Signing link is invalid." },
      { status: 404 },
    );
  }

  let signedPdfPath: string | undefined;

  try {
    const body: unknown = await request.json();
    const signatureData =
      body && typeof body === "object"
        ? (body as { signatureData?: unknown }).signatureData
        : null;

    if (
      typeof signatureData !== "string" ||
      signatureData.length > 2_000_000 ||
      !decodeSignatureData(signatureData)
    ) {
      return NextResponse.json(
        { error: "Signature is invalid." },
        { status: 400 },
      );
    }

    const [pending] = await db
      .select({
        id: signingRequests.id,
        pdfPath: signingRequests.pdfPath,
        pdfFileName: signingRequests.pdfFileName,
        signerName: signingRequests.signerName,
        signerEmail: signingRequests.signerEmail,
        signatureBox: signingRequests.signatureBox,
      })
      .from(signingRequests)
      .where(
        and(
          eq(signingRequests.tokenNumber, tokenNumber),
          eq(signingRequests.status, "pending"),
          gt(signingRequests.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!pending) {
      return NextResponse.json(
        { error: "This signing link has expired or has already been used." },
        { status: 410 },
      );
    }

    if (!isValidSignatureBox(pending.signatureBox)) {
      return NextResponse.json(
        { error: "This signing request has no valid signature box." },
        { status: 409 },
      );
    }

    const signatureBox: SignatureBox = pending.signatureBox;

    const { data: originalFile, error: downloadError } =
      await supabaseAdmin.storage.from(BUCKET).download(pending.pdfPath);

    if (downloadError || !originalFile) {
      console.error("Could not download source PDF:", downloadError?.message);
      return NextResponse.json(
        { error: "Could not load the original PDF." },
        { status: 502 },
      );
    }

    const sourceBytes = new Uint8Array(await originalFile.arrayBuffer());
    const pdf = await PDFDocument.load(sourceBytes);
    const pages = pdf.getPages();

    if (signatureBox.page >= pages.length) {
      return NextResponse.json(
        { error: "The saved signature box points to a missing PDF page." },
        { status: 409 },
      );
    }

    const signatureBytes = decodeSignatureData(signatureData);
    if (!signatureBytes) {
      return NextResponse.json(
        { error: "Signature is invalid." },
        { status: 400 },
      );
    }

    const image = await pdf.embedPng(signatureBytes);
    const page = pages[signatureBox.page];
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    page.drawImage(image, {
      x: signatureBox.x * pageWidth,
      y: pageHeight - (signatureBox.y + signatureBox.height) * pageHeight,
      width: signatureBox.width * pageWidth,
      height: signatureBox.height * pageHeight,
    });

    const signedPdfBytes = await pdf.save();
    signedPdfPath = `signed/${randomUUID()}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(signedPdfPath, Buffer.from(signedPdfBytes), {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Could not upload signed PDF:", uploadError.message);
      return NextResponse.json(
        { error: "Could not save the signed PDF." },
        { status: 502 },
      );
    }

    const signedIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const signedUserAgent = request.headers.get("user-agent");

    const [updated] = await db
      .update(signingRequests)
      .set({
        status: "signed",
        signatureData,
        signedIp,
        signedUserAgent,
        signedAt: new Date(),
        signedPdfPath,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(signingRequests.id, pending.id),
          eq(signingRequests.status, "pending"),
          gt(signingRequests.expiresAt, new Date()),
        ),
      )
      .returning({ id: signingRequests.id });

    if (!updated) {
      await supabaseAdmin.storage.from(BUCKET).remove([signedPdfPath]);
      return NextResponse.json(
        { error: "This signing link has expired or has already been used." },
        { status: 410 },
      );
    }

    try {
      await emailSigningNotice({
        signerName: pending.signerName,
        signerEmail: pending.signerEmail,
        pdfFileName: pending.pdfFileName,
        signedPdfBytes,
      });
    } catch (emailError) {
      console.error(
        "Signature saved, but Resend notification failed:",
        emailError,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Could not save signature:", error);

    if (signedPdfPath) {
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([signedPdfPath])
        .catch(() => undefined);
    }

    return NextResponse.json(
      { error: "Could not save your signature." },
      { status: 500 },
    );
  }
}
