"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import type { SignatureBox } from "@/lib/signing/signature-box";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type SignDocumentProps = {
  tokenNumber: number;
  pdfUrl: string;
  fileName: string;
  signerName: string;
  signatureBox: SignatureBox;
};

type PdfPageInfo = {
  width: number;
  height: number;
};

export default function SignDocument({
  tokenNumber,
  pdfUrl,
  fileName,
  signerName,
  signatureBox,
}: SignDocumentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageFrameRef = useRef<HTMLDivElement>(null);

  const [pageCount, setPageCount] = useState(0);
  const [pageInfo, setPageInfo] = useState<PdfPageInfo | null>(null);
  const [renderWidth, setRenderWidth] = useState(800);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const pageNumber = signatureBox.page + 1;

  useEffect(() => {
    const frame = pageFrameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      setRenderWidth(Math.max(280, entry.contentRect.width));
    });

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const handleDocumentLoad = useCallback(
    ({ numPages }: { numPages: number }) => {
      setPageCount(numPages);
    },
    [],
  );

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const point = getPoint(event);
    if (!canvas || !point || submitting) return;

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);

    const context = canvas.getContext("2d");
    if (!context) return;

    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineWidth = Math.max(2, canvas.width / 280);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";

    setDrawing(true);
    setError("");
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getPoint(event);

    if (!context || !point) return;

    event.preventDefault();
    context.lineTo(point.x, point.y);
    context.stroke();
    setHasSignature(true);
  }

  function stopDrawing() {
    setDrawing(false);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setError("");
  }

  async function submitSignature() {
    const canvas = canvasRef.current;

    if (!canvas || !hasSignature) {
      setError("Please sign inside the highlighted box before continuing.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/signing-requests/${tokenNumber}/sign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signatureData: canvas.toDataURL("image/png"),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not submit your signature.");
      }

      window.location.assign("https://yourapplianceking.com/success.php");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "A network error occurred. Please try again.",
      );
      setSubmitting(false);
    }
  }

  if (pageCount > 0 && signatureBox.page >= pageCount) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <p role="alert" className="text-center text-red-600">
          This signing request has an invalid signature location. Please contact
          the sender.
        </p>
      </main>
    );
  }

  const boxStyle = pageInfo
    ? {
        left: `${signatureBox.x * 100}%`,
        top: `${signatureBox.y * 100}%`,
        width: `${signatureBox.width * 100}%`,
        height: `${signatureBox.height * 100}%`,
      }
    : undefined;

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-zinc-100 text-zinc-950">
      <header className="z-10 flex shrink-0 items-center justify-between gap-4 border-b bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold sm:text-lg">
            Review and sign
          </h1>
          <p className="truncate text-sm text-zinc-600">
            {fileName}
            {signerName ? ` · ${signerName}` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={clearSignature}
          disabled={!hasSignature || submitting}
          className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear signature
        </button>
      </header>

      <section
        ref={pageFrameRef}
        className="min-h-0 flex-1 overflow-auto bg-zinc-200 p-3 sm:p-6"
        aria-label="PDF document with signature location"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setPageCount(numPages)}
          onLoadError={(error) => {
            console.error("PDF load failed:", error);
            setError(`Could not load PDF: ${error.message}`);
          }}
          loading={<p className="p-8 text-center">Opening PDF…</p>}
          error={
            <p role="alert" className="p-8 text-center text-red-600">
              Could not open this PDF. Please contact a team member or reply to
              the one that sent you this and we will swiftly fix it!
            </p>
          }
        >
          <div className="mx-auto w-fit shadow-xl">
            <div className="relative bg-white">
              <Page
                pageNumber={pageNumber}
                width={renderWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={(page) => {
                  const viewport = page.getViewport({
                    scale: renderWidth / page.getViewport({ scale: 1 }).width,
                  });
                  setPageInfo({
                    width: viewport.width,
                    height: viewport.height,
                  });
                }}
              />

              {pageInfo && boxStyle && (
                <div
                  className="absolute z-10 border-2 border-blue-700 bg-blue-200/35 shadow-[0_0_0_9999px_rgba(15,23,42,0.13)]"
                  style={boxStyle}
                >
                  <div className="absolute -top-8 left-0 rounded-t-md bg-blue-700 px-3 py-1 text-xs font-bold text-white sm:text-sm">
                    Sign here
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={1200}
                    height={Math.max(
                      240,
                      Math.round(
                        (1200 * signatureBox.height) / signatureBox.width,
                      ),
                    )}
                    className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    onLostPointerCapture={stopDrawing}
                    aria-label="Sign inside this highlighted box"
                  />
                </div>
              )}
            </div>
          </div>
        </Document>
      </section>

      <footer className="z-10 shrink-0 border-t bg-white px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5 text-sm">
            {error ? (
              <p role="alert" className="text-red-600">
                {error}
              </p>
            ) : (
              <p className="text-zinc-600">
                Sign inside the highlighted box on page {pageNumber}.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={submitSignature}
            disabled={submitting || !hasSignature || !pageInfo}
            className="rounded-md bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Continue"}
          </button>
        </div>
      </footer>
    </main>
  );
}
