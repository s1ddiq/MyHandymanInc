import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { signingRequests } from "@/db/schema";
import { Resend } from "resend";

export const runtime = "nodejs";

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

async function emailSigningNotice(details: {
  signerName: string | null;
  signerEmail: string | null;
  pdfFileName: string | null;
}) {
  const from = process.env.CONTACT_EMAIL_FROM;

  if (!process.env.RESEND_API_KEY || !from) {
    throw new Error("RESEND_API_KEY or RESEND_FROM_EMAIL is missing.");
  }

  const name = details.signerName?.trim() || "Not provided";
  const email = details.signerEmail?.trim() || "Not provided";
  const fileName = details.pdfFileName?.trim() || "PDF document";

  const { data, error } = await resend.emails.send({
    from,
    to: ["myhandymaninc1@gmail.com", "snashct@gmail.com"],
    subject: `Signed document ready: ${fileName}`,
    text: [
      "A signing request has been completed.",
      "",
      `Signer: ${name}`,
      `Signer email: ${email}`,
      `Document: ${fileName}`,
      "",
      "The signature has been saved in the signing system.",
    ].join("\n"),
    html: `
      <h2>Signed document ready</h2>
      <p>A signing request has been completed.</p>
      <ul>
        <li><strong>Signer:</strong> ${escapeHtml(name)}</li>
        <li><strong>Signer email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Document:</strong> ${escapeHtml(fileName)}</li>
      </ul>
      <p>The signature has been saved in the signing system.</p>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
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

  try {
    const body = await request.json();
    const signatureData = body?.signatureData;

    if (
      typeof signatureData !== "string" ||
      !/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(signatureData) ||
      signatureData.length > 2_000_000
    ) {
      return NextResponse.json(
        { error: "Signature is invalid." },
        { status: 400 },
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const signedIp = forwardedFor?.split(",")[0]?.trim() ?? null;
    const signedUserAgent = request.headers.get("user-agent");

    const [signed] = await db
      .update(signingRequests)
      .set({
        status: "signed",
        signatureData,
        signedIp,
        signedUserAgent,
        signedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(signingRequests.tokenNumber, tokenNumber),
          eq(signingRequests.status, "pending"),
          gt(signingRequests.expiresAt, new Date()),
        ),
      )
      .returning({
        signerName: signingRequests.signerName,
        signerEmail: signingRequests.signerEmail,
        pdfFileName: signingRequests.pdfFileName,
      });

    if (!signed) {
      return NextResponse.json(
        { error: "This signing link has expired or has already been used." },
        { status: 410 },
      );
    }

    // The signature is saved even if email delivery has a problem.
    try {
      await emailSigningNotice(signed);
    } catch (emailError) {
      console.error(
        "Signature saved, but Resend notification failed:",
        emailError,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Could not save signature:", error);
    return NextResponse.json(
      { error: "Could not save your signature." },
      { status: 500 },
    );
  }
}
