import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { db } from "@/db";
import { accessCodes, signingRequests } from "@/db/schema";
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

function generateAccessCode() {
  return randomBytes(5).toString("hex").toUpperCase();
}

function safeFileName(value: string | null) {
  const baseName = value?.trim() || "signed-document.pdf";
  const cleaned = baseName.replace(/[\r\n"\\/]/g, "_");

  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

async function emailSigningNotice(details: {
  tokenNumber: number;
  accessCode: string;
  signerName: string | null;
  signerEmail: string | null;
  pdfFileName: string | null;
}) {
  const from = process.env.CONTACT_EMAIL_FROM;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const email = details.signerEmail?.trim();

  if (!process.env.RESEND_API_KEY || !from) {
    throw new Error("RESEND_API_KEY or CONTACT_EMAIL_FROM is missing.");
  }

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is missing.");
  }

  if (!email) {
    throw new Error("Signer email is missing.");
  }

  const name = details.signerName?.trim() || "there";
  const fileName = safeFileName(details.pdfFileName);
  const downloadUrl = new URL(
    `/api/signing/${details.tokenNumber}/signed-pdf?download=1`,
    appUrl,
  ).toString();
  const supportEmail = "snashct@gmail.com";

  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject: `Your signed document: ${fileName}`,
    text: [
      `Hi ${name},`,
      "",
      "You have successfully signed the document.",
      "",
      "Click the link below to download a copy of the document with your signature:",
      downloadUrl,
      "",
      `Enter this access code when prompted: ${details.accessCode}`,
      "",
      `If you have an issue downloading the document, please contact ${supportEmail}.`,
      "",
      `Document: ${fileName}`,
    ].join("\n"),
    html: `
      <p>Hi ${escapeHtml(name)},</p>
      <p>You have successfully signed the document.</p>
      <p>
        <a href="${escapeHtml(downloadUrl)}">
          Download a copy of your signed document
        </a>
      </p>
      <p>Enter this access code when prompted:</p>
      <p style="font-size: 22px; font-weight: bold; letter-spacing: 3px;">
        ${escapeHtml(details.accessCode)}
      </p>
      <p>
        If you have an issue downloading the document, please contact
        <a href="mailto:${supportEmail}">${supportEmail}</a>.
      </p>
      <p>Document: ${escapeHtml(fileName)}</p>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
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
        tokenNumber: signingRequests.tokenNumber,
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

    const pdf = await PDFDocument.load(
      new Uint8Array(await originalFile.arrayBuffer()),
    );
    const pages = pdf.getPages();

    if (signatureBox.page < 0 || signatureBox.page >= pages.length) {
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

    page.drawImage(image, {
      x: signatureBox.x * page.getWidth(),
      y:
        page.getHeight() -
        (signatureBox.y + signatureBox.height) * page.getHeight(),
      width: signatureBox.width * page.getWidth(),
      height: signatureBox.height * page.getHeight(),
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

    const accessCode = generateAccessCode();
    const signedAt = new Date();

    const [updated] = await db
      .update(signingRequests)
      .set({
        status: "signed",
        signatureData,
        signedIp:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        signedUserAgent: request.headers.get("user-agent"),
        signedAt,
        signedPdfPath,
        updatedAt: signedAt,
      })
      .where(
        and(
          eq(signingRequests.id, pending.id),
          eq(signingRequests.status, "pending"),
          gt(signingRequests.expiresAt, signedAt),
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

    await db.insert(accessCodes).values({
      code: accessCode,
      signingRequestId: pending.id,
      isActive: true,
      expiresAt: null,
    });

    try {
      await emailSigningNotice({
        tokenNumber: pending.tokenNumber,
        accessCode,
        signerName: pending.signerName,
        signerEmail: pending.signerEmail,
        pdfFileName: pending.pdfFileName,
      });
    } catch (emailError) {
      console.error("Signature saved, but signer email failed:", emailError);
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
