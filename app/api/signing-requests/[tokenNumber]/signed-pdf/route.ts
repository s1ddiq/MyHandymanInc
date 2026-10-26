import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { accessCodes, signingRequests } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkRole } from "@/lib/utils/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "signing-documents";

function safeFileName(value: string | null) {
  const baseName = value?.trim() || "signed-document.pdf";
  const cleaned = baseName.replace(/[\r\n"\\/]/g, "_");

  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

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

function accessCodePage(message = "") {
  const escapedMessage = message
    ? `<p class="message">${escapeHtml(message)}</p>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Download signed document</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        box-sizing: border-box;
        background: #f4f4f5;
        color: #18181b;
        font-family: Arial, sans-serif;
      }
      main {
        width: min(100%, 420px);
        padding: 28px;
        border: 1px solid #e4e4e7;
        border-radius: 16px;
        background: white;
        box-sizing: border-box;
        box-shadow: 0 10px 30px rgb(0 0 0 / 6%);
      }
      h1 { margin: 0 0 10px; font-size: 24px; }
      p { line-height: 1.5; color: #52525b; }
      label { display: block; margin: 20px 0 8px; font-weight: 600; }
      input {
        width: 100%;
        padding: 12px;
        border: 1px solid #d4d4d8;
        border-radius: 8px;
        box-sizing: border-box;
        font-size: 18px;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      button {
        width: 100%;
        margin-top: 14px;
        padding: 12px;
        border: 0;
        border-radius: 8px;
        background: #18181b;
        color: white;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
      }
      .message { color: #b91c1c; }
    </style>
  </head>
  <body>
    <main>
      <h1>Your signed document is ready</h1>
      <p>Enter the access code from your email to download a copy of the document with your signature.</p>
      ${escapedMessage}
      <form method="post">
        <label for="accessCode">Access code</label>
        <input
          id="accessCode"
          name="accessCode"
          autocomplete="one-time-code"
          autocapitalize="characters"
          maxlength="10"
          required
        />
        <button type="submit">Verify code and download</button>
      </form>
    </main>
  </body>
</html>`;
}

function htmlResponse(html: string, status = 200) {
  return new NextResponse(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function getSigningRequest(rawNumber: string) {
  if (!/^[1-9]\d*$/.test(rawNumber)) return null;

  const tokenNumber = Number(rawNumber);

  if (!Number.isSafeInteger(tokenNumber)) return null;

  const [row] = await db
    .select({
      id: signingRequests.id,
      signedPdfPath: signingRequests.signedPdfPath,
      pdfFileName: signingRequests.pdfFileName,
      status: signingRequests.status,
    })
    .from(signingRequests)
    .where(eq(signingRequests.tokenNumber, tokenNumber))
    .limit(1);

  if (!row || row.status !== "signed" || !row.signedPdfPath) return null;

  return {
    ...row,
    signedPdfPath: row.signedPdfPath,
  };
}

async function serveSignedPdf(
  signingRequest: {
    signedPdfPath: string;
    pdfFileName: string | null;
  },
  request: Request,
) {
  const { data: pdf, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .download(signingRequest.signedPdfPath);

  if (error || !pdf) {
    console.error("Could not download signed PDF:", error?.message);

    return NextResponse.json(
      { error: "Could not load the signed PDF." },
      { status: 502 },
    );
  }

  const fileName = safeFileName(signingRequest.pdfFileName);
  const download = new URL(request.url).searchParams.get("download") === "1";

  return new NextResponse(await pdf.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tokenNumber: string }> },
) {
  const { tokenNumber } = await params;
  const signingRequest = await getSigningRequest(tokenNumber);

  if (!signingRequest) {
    return NextResponse.json(
      { error: "The signed PDF is not available." },
      { status: 404 },
    );
  }

  if (await checkRole("admin")) {
    return serveSignedPdf(signingRequest, request);
  }

  return htmlResponse(accessCodePage());
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tokenNumber: string }> },
) {
  try {
    const { tokenNumber } = await params;
    const signingRequest = await getSigningRequest(tokenNumber);

    if (!signingRequest) {
      return NextResponse.json(
        { error: "The signed PDF is not available." },
        { status: 404 },
      );
    }

    if (await checkRole("admin")) {
      return serveSignedPdf(signingRequest, request);
    }

    const formData = await request.formData();
    const submittedCode = formData.get("accessCode");

    if (typeof submittedCode !== "string") {
      return htmlResponse(
        accessCodePage("Enter the access code from your email."),
        400,
      );
    }

    const normalizedCode = submittedCode.trim().toUpperCase();

    if (!/^[A-F0-9]{10}$/.test(normalizedCode)) {
      return htmlResponse(
        accessCodePage("That access code is not valid."),
        400,
      );
    }

    const [validCode] = await db
      .select({ id: accessCodes.id })
      .from(accessCodes)
      .where(
        and(
          eq(accessCodes.code, normalizedCode),
          eq(accessCodes.signingRequestId, signingRequest.id),
          eq(accessCodes.isActive, true),
        ),
      )
      .limit(1);

    if (!validCode) {
      return htmlResponse(accessCodePage("That access code is invalid."), 403);
    }

    return serveSignedPdf(signingRequest, request);
  } catch (error) {
    console.error("Could not verify signed PDF access code:", error);

    return htmlResponse(
      accessCodePage("Could not verify the code. Please try again."),
      500,
    );
  }
}
