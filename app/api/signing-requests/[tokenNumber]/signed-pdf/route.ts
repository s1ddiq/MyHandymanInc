import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { signingRequests } from "@/db/schema";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tokenNumber: string }> },
) {
  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { tokenNumber: rawNumber } = await params;

  if (!/^[1-9]\d*$/.test(rawNumber)) {
    return NextResponse.json(
      { error: "Signing request not found." },
      { status: 404 },
    );
  }

  const tokenNumber = Number(rawNumber);

  if (!Number.isSafeInteger(tokenNumber)) {
    return NextResponse.json(
      { error: "Signing request not found." },
      { status: 404 },
    );
  }

  try {
    const [signingRequest] = await db
      .select({
        signedPdfPath: signingRequests.signedPdfPath,
        pdfFileName: signingRequests.pdfFileName,
        status: signingRequests.status,
      })
      .from(signingRequests)
      .where(eq(signingRequests.tokenNumber, tokenNumber))
      .limit(1);

    if (
      !signingRequest ||
      signingRequest.status !== "signed" ||
      !signingRequest.signedPdfPath
    ) {
      return NextResponse.json(
        { error: "The signed PDF is not available." },
        { status: 404 },
      );
    }

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
    const disposition = download ? "attachment" : "inline";

    return new NextResponse(await pdf.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Could not serve signed PDF:", error);

    return NextResponse.json(
      { error: "Could not load the signed PDF." },
      { status: 500 },
    );
  }
}
