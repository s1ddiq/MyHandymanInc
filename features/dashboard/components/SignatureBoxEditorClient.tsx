"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Check, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SignatureBox } from "@/lib/signing/signature-box";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Keep the worker version matched to the installed pdfjs-dist package.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type SignatureBoxEditorProps = {
  file: File;
  open: boolean;
  initialBox: SignatureBox | null;
  onOpenChange: (open: boolean) => void;
  onSave: (box: SignatureBox) => void;
};

type Point = { x: number; y: number };
type DragSelection = { start: Point; end: Point };

export default function SignatureBoxEditorClient({
  file,
  open,
  initialBox,
  onOpenChange,
  onSave,
}: SignatureBoxEditorProps) {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(initialBox?.page ?? 0);
  const [pageWidth, setPageWidth] = useState(720);
  const [pageHeight, setPageHeight] = useState(0);
  const [selection, setSelection] = useState<DragSelection | null>(null);
  const [savedBox, setSavedBox] = useState<SignatureBox | null>(initialBox);
  const [error, setError] = useState("");

  useEffect(() => {
    setSavedBox(initialBox);
    setPage(initialBox?.page ?? 0);
    setSelection(null);
    setError("");
  }, [initialBox, file, open]);

  useEffect(() => {
    const node = pageContainerRef.current;
    if (!node || !open) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.min(900, Math.max(280, entry.contentRect.width));
      setPageWidth(width);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  const onDocumentLoad = useCallback(
    ({ numPages }: { numPages: number }) => {
      setPageCount(numPages);
      if (initialBox && initialBox.page < numPages) {
        setPage(initialBox.page);
      } else {
        setPage(0);
      }
    },
    [initialBox],
  );

  function pointFromEvent(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
    };
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!pageHeight) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    setSelection({ start: point, end: point });
    setError("");
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const point = pointFromEvent(event); // Read currentTarget immediately.

    setSelection((current) => {
      if (!current) return current;
      return { ...current, end: point };
    });
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const point = pointFromEvent(event);

    setSelection((current) => {
      if (!current) return null;

      const left = Math.min(current.start.x, point.x);
      const top = Math.min(current.start.y, point.y);
      const width = Math.abs(point.x - current.start.x);
      const height = Math.abs(point.y - current.start.y);

      if (width < 45 || height < 24 || !pageWidth || !pageHeight) {
        setError("Draw a larger signature box on the PDF.");
        return null;
      }

      const box: SignatureBox = {
        page,
        x: left / pageWidth,
        y: top / pageHeight,
        width: width / pageWidth,
        height: height / pageHeight,
      };

      setSavedBox(box);
      return null;
    });
  }

  const activeBox = savedBox?.page === page ? savedBox : null;
  const dragBox = selection
    ? {
        left: Math.min(selection.start.x, selection.end.x),
        top: Math.min(selection.start.y, selection.end.y),
        width: Math.abs(selection.end.x - selection.start.x),
        height: Math.abs(selection.end.y - selection.start.y),
      }
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[96vh] w-[98vw] max-w-none flex-col gap-0 p-0 sm:max-w-none">
        <DialogHeader className="border-b p-4 pr-12">
          <DialogTitle>Choose where the customer signs</DialogTitle>
          <DialogDescription>
            Click and drag on the PDF to place a signature box. You can move to
            another page and draw again.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {pageCount ? `Page ${page + 1} of ${pageCount}` : "Loading PDF…"}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pageCount || page >= pageCount - 1}
              onClick={() =>
                setPage((current) => Math.min(pageCount - 1, current + 1))
              }
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div
            ref={pageContainerRef}
            className="min-h-0 flex-1 overflow-auto bg-zinc-100 p-4 dark:bg-zinc-950"
          >
            <Document
              file={file}
              onLoadSuccess={onDocumentLoad}
              onLoadError={() => setError("Could not read this PDF file.")}
              loading={
                <div className="flex items-center justify-center gap-2 p-12 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading PDF…
                </div>
              }
              error={
                <p className="p-8 text-center text-sm text-destructive">
                  Could not display this PDF.
                </p>
              }
            >
              <div className="mx-auto w-fit shadow-lg">
                <div
                  className="relative touch-none select-none"
                  style={{ width: pageWidth }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  <Page
                    pageNumber={page + 1}
                    width={pageWidth}
                    onRenderSuccess={(pdfPage) => {
                      const viewport = pdfPage.getViewport({
                        scale:
                          pageWidth / pdfPage.getViewport({ scale: 1 }).width,
                      });
                      setPageHeight(viewport.height);
                    }}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />

                  {activeBox && (
                    <div
                      className="pointer-events-none absolute border-2 border-dashed border-blue-600 bg-blue-400/20"
                      style={{
                        left: `${activeBox.x * 100}%`,
                        top: `${activeBox.y * 100}%`,
                        width: `${activeBox.width * 100}%`,
                        height: `${activeBox.height * 100}%`,
                      }}
                    >
                      <span className="absolute -top-7 left-0 whitespace-nowrap rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                        Sign here
                      </span>
                    </div>
                  )}

                  {dragBox && (
                    <div
                      className="pointer-events-none absolute border-2 border-blue-600 bg-blue-400/30"
                      style={{
                        left: dragBox.left,
                        top: dragBox.top,
                        width: dragBox.width,
                        height: dragBox.height,
                      }}
                    />
                  )}
                </div>
              </div>
            </Document>
          </div>

          {error && (
            <p
              role="alert"
              className="border-t px-4 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 border-t p-4">
            <p className="text-sm text-muted-foreground">
              {savedBox
                ? `Signature box set on page ${savedBox.page + 1}. Draw again to replace it.`
                : "No signature box selected yet."}
            </p>

            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!savedBox}
                onClick={() => savedBox && onSave(savedBox)}
              >
                <Check className="mr-2 h-4 w-4" />
                Save location
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
