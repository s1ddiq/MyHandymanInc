import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { signingRequests } from "@/db/schema";
import { supabaseAdmin } from "@/lib/supabase-admin";
import SignDocument from "./sign-document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SignPage({
  params,
}: {
  params: Promise<{ tokenNumber: string }>;
}) {
  const { tokenNumber: rawNumber } = await params;

  if (!/^[1-9]\d*$/.test(rawNumber)) notFound();

  const tokenNumber = Number(rawNumber);
  if (!Number.isSafeInteger(tokenNumber)) notFound();

  const [signingRequest] = await db
    .select()
    .from(signingRequests)
    .where(eq(signingRequests.tokenNumber, tokenNumber))
    .limit(1);

  if (
    !signingRequest ||
    signingRequest.status !== "pending" ||
    signingRequest.expiresAt <= new Date()
  ) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">
          This signing link has expired.
        </h1>
      </main>
    );
  }

  const { data, error } = await supabaseAdmin.storage
    .from("signing-documents")
    .createSignedUrl(signingRequest.pdfPath, 10 * 60);

  if (error || !data?.signedUrl) {
    console.error("Could not create PDF link:", error?.message);
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">
          The document could not be loaded.
        </h1>
      </main>
    );
  }

  return (
    <SignDocument
      tokenNumber={tokenNumber}
      pdfUrl={data.signedUrl}
      fileName={signingRequest.pdfFileName ?? "Document.pdf"}
      signerName={signingRequest.signerName ?? ""}
    />
  );
}
