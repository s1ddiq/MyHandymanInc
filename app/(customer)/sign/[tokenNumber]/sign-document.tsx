"use client";

import { useRef, useState } from "react";

export default function SignDocument({
  tokenNumber,
  pdfUrl,
  fileName,
  signerName,
}: {
  tokenNumber: number;
  pdfUrl: string;
  fileName: string;
  signerName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    canvas.setPointerCapture(event.pointerId);
    const ctx = canvas.getContext("2d")!;
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setDrawing(true);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = point(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function stopDrawing() {
    setDrawing(false);
  }

  function clearSignature() {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function submitSignature() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const hasSignature = pixels.some(
      (value, index) => index % 4 === 3 && value !== 0,
    );

    if (!hasSignature) {
      setError("Please sign in the box before continuing.");
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
        setError(result.error ?? "Could not submit your signature.");
        setSubmitting(false);
        return;
      }

      window.location.assign("https://yourapplianceking.com/success.php");
    } catch {
      setError("A network error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-4 sm:p-8">
      <h1 className="text-2xl font-semibold">Review and sign {fileName}</h1>

      <iframe
        src={pdfUrl}
        title={fileName}
        className="h-[65vh] w-full rounded border"
      />

      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Signature{signerName ? ` for ${signerName}` : ""}
        </h2>
        <canvas
          ref={canvasRef}
          width={900}
          height={240}
          className="w-full touch-none rounded border border-gray-400 bg-white"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          aria-label="Signature box"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={clearSignature}
            className="rounded border px-4 py-2"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={submitSignature}
            disabled={submitting}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Continue"}
          </button>
        </div>
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
