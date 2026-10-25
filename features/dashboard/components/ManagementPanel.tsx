"use client";

import { useRef, useState } from "react";
import { Clipboard, FileSignature, Loader2, Upload, X } from "lucide-react";

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
import TeamChatSheet from "./TeamChatSheet";

export default function ManagementPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signingLink, setSigningLink] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSigningLink("");

    if (!file) {
      setError("Choose a PDF to upload.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("signerName", signerName);
    formData.append("signerEmail", signerEmail);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signing-requests", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not create the signing request.",
        );
      }

      setSigningLink(result.link);
      formRef.current?.reset();
      setFile(null);
      setSignerName("");
      setSignerEmail("");
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

    await navigator.clipboard.writeText(signingLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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

          <label
            htmlFor="signingPdf"
            className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center transition hover:bg-muted/50"
          >
            {file ? (
              <>
                <FileSignature className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Choose a PDF</span>
                <span className="text-xs text-muted-foreground">
                  PDF files only
                </span>
              </>
            )}
          </label>

          <input
            id="signingPdf"
            name="pdf"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
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
          disabled={isSubmitting || !file}
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
      <div className="mt-8">
        <TeamChatSheet />
      </div>
    </div>
  );

  return (
    <>
      {/* Persistent side panel on extra-large screens */}
      <aside className="hidden h-full w-[380px] shrink-0 flex-col border-l bg-white dark:bg-zinc-900 xl:flex">
        {panelContent}
      </aside>

      {/* Smaller screens: button opens the management panel */}
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
    </>
  );
}
