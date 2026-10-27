"use client";

import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Check,
  Clipboard,
  FileSignature,
  Loader2,
  MapPin,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RecentSignatures from "@/features/dashboard/components/RecentSignatures";
import SignatureBoxEditor from "./SignatureBoxEditorClient";
import type { SignatureBox } from "@/lib/signing/signature-box";

const MAX_PDF_BYTES = 20 * 1024 * 1024;

function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase public URL/key is not configured.");
  }

  return createClient(url, key);
}

export default function ManagementPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [signatureBox, setSignatureBox] = useState<SignatureBox | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signingLink, setSigningLink] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleFileChange(selectedFile: File | null) {
    setError("");
    setSigningLink("");
    setSignatureBox(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const hasPdfExtension = selectedFile.name.toLowerCase().endsWith(".pdf");
    const hasPdfMimeType =
      !selectedFile.type || selectedFile.type === "application/pdf";

    if (!hasPdfExtension || !hasPdfMimeType) {
      setFile(null);
      setError("Please choose a PDF file.");
      return;
    }

    if (selectedFile.size > MAX_PDF_BYTES) {
      setFile(null);
      setError("PDF must be 20 MB or smaller.");
      return;
    }

    setFile(selectedFile);
    setIsEditorOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSigningLink("");

    if (!file) {
      setError("Choose a PDF to upload.");
      return;
    }

    if (!signatureBox) {
      setError("Choose where the signer should sign in the PDF.");
      setIsEditorOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Ask the server for a one-time Supabase upload token.
      const prepareResponse = await fetch("/api/signing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "prepare",
          fileName: file.name,
          fileSize: file.size,
          contentType: "application/pdf",
        }),
      });

      const prepared = await prepareResponse.json();

      if (!prepareResponse.ok) {
        throw new Error(prepared.error || "Could not prepare the PDF upload.");
      }

      if (
        typeof prepared.pdfPath !== "string" ||
        typeof prepared.token !== "string"
      ) {
        throw new Error("The server returned an invalid upload token.");
      }

      // Send the PDF directly from the browser to Supabase Storage.
      const supabase = createBrowserSupabaseClient();
      const { error: uploadError } = await supabase.storage
        .from("signing-documents")
        .uploadToSignedUrl(prepared.pdfPath, prepared.token, file, {
          contentType: "application/pdf",
        });

      if (uploadError) {
        throw new Error(`PDF upload failed: ${uploadError.message}`);
      }

      // Send only metadata to Vercel; the PDF itself is already in Storage.
      const completeResponse = await fetch("/api/signing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          pdfPath: prepared.pdfPath,
          pdfFileName: file.name,
          signerName,
          signerEmail,
          signatureBox,
        }),
      });

      const result = await completeResponse.json();

      if (!completeResponse.ok) {
        throw new Error(
          result.error || "Could not create the signing request.",
        );
      }

      setSigningLink(result.link);
      formRef.current?.reset();
      setFile(null);
      setSignatureBox(null);
      setSignerName("");
      setSignerEmail("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyLink() {
    if (!signingLink) return;

    try {
      await navigator.clipboard.writeText(signingLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the link. Please copy it manually.");
    }
  }

  const panelContent = (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6">
        <h2 className="font-semibold">Management Panel</h2>
        <p className="text-sm text-muted-foreground">
          Send invoices, signature requests and more coming soon.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="signerName">Signer name</Label>
          <Input
            id="signerName"
            name="signerName"
            value={signerName}
            onChange={(event) => setSignerName(event.target.value)}
            placeholder="Customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signerEmail">Signer email</Label>
          <Input
            id="signerEmail"
            name="signerEmail"
            type="email"
            value={signerEmail}
            onChange={(event) => setSignerEmail(event.target.value)}
            placeholder="customer@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signingPdf">PDF document</Label>

          <input
            ref={fileInputRef}
            id="signingPdf"
            name="pdf"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(event) =>
              handleFileChange(event.target.files?.[0] ?? null)
            }
          />

          <Button
            type="button"
            variant="outline"
            className="h-auto w-full justify-start gap-3 whitespace-normal p-4 text-left"
            onClick={() => fileInputRef.current?.click()}
          >
            {file ? (
              <>
                <FileSignature className="h-6 w-6 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {file.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 shrink-0" />
                <span>Choose a PDF</span>
              </>
            )}
          </Button>

          {file && (
            <Button
              type="button"
              variant={signatureBox ? "secondary" : "outline"}
              className="w-full"
              onClick={() => setIsEditorOpen(true)}
            >
              {signatureBox ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              {signatureBox
                ? `Signature location set (page ${signatureBox.page + 1})`
                : "Choose signature location"}
            </Button>
          )}

          <p className="text-xs text-muted-foreground">
            The PDF uploads after you choose the signature location.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {signingLink && (
          <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
            <div>
              <p className="text-sm font-semibold">Signing link created</p>
              <p className="mt-1 break-all text-sm text-muted-foreground">
                {signingLink}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={copyLink}
            >
              <Clipboard className="mr-2 h-4 w-4" />
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !file || !signatureBox}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            "Create signing link"
          )}
        </Button>
      </form>

      <div className="mt-8 border-t pt-6">
        <RecentSignatures />
      </div>

      <div className="mt-8" />
    </div>
  );

  return (
    <>
      <aside className="hidden h-full w-[380px] shrink-0 flex-col border-l bg-white dark:bg-zinc-900 xl:flex">
        {panelContent}
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg xl:hidden"
            aria-label="Open management panel"
          >
            <FileSignature className="mr-2 h-4 w-4" />
            Management
          </Button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="h-[85vh] overflow-y-auto rounded-t-2xl p-0 xl:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Management Panel</SheetTitle>
            <SheetDescription>
              Create signing requests and view recent signatures.
            </SheetDescription>
          </SheetHeader>

          {panelContent}
        </SheetContent>
      </Sheet>

      {file && (
        <SignatureBoxEditor
          file={file}
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          initialBox={signatureBox}
          onSave={(box) => {
            setSignatureBox(box);
            setError("");
            setIsEditorOpen(false);
          }}
        />
      )}
    </>
  );
}
