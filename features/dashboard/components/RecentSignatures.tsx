"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileSignature, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";

type SignedRequest = {
  tokenNumber: number;
  signerName: string | null;
  signerEmail: string | null;
  pdfFileName: string | null;
  signedAt: Date | string | null;
  hasSignedPdf: boolean;
};

function signedPdfUrl(tokenNumber: number, download = false) {
  const base = `/api/signing-requests/${tokenNumber}/signed-pdf`;
  return download ? `${base}?download=1` : base;
}

export default function RecentSignatures() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<SignedRequest[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [previewToken, setPreviewToken] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");

  const recentSignedOptions = trpc.signingRequests.getRecentSigned.queryOptions(
    { search, offset: 0 },
  );

  const query = useQuery({
    ...recentSignedOptions,
    enabled: open,
  });

  useEffect(() => {
    if (!query.data) return;

    setRequests(query.data.requests as SignedRequest[]);
    setOffset(query.data.nextOffset);
    setHasMore(query.data.hasMore);
  }, [query.data]);

  async function loadMore() {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setLoadMoreError("");

    try {
      const nextOptions = trpc.signingRequests.getRecentSigned.queryOptions({
        search,
        offset,
      });

      const result = await queryClient.fetchQuery(nextOptions);

      setRequests((current) => [
        ...current,
        ...(result.requests as SignedRequest[]),
      ]);
      setOffset(result.nextOffset);
      setHasMore(result.hasMore);
    } catch {
      setLoadMoreError("Could not load more signed documents.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setRequests([]);
    setOffset(0);
    setHasMore(false);
    setPreviewToken(null);
    setLoadMoreError("");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setSearch("");
      setRequests([]);
      setOffset(0);
      setHasMore(false);
      setPreviewToken(null);
      setLoadMoreError("");
    }
  }

  function togglePreview(tokenNumber: number) {
    setPreviewToken((current) =>
      current === tokenNumber ? null : tokenNumber,
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          <FileSignature className="mr-2 h-4 w-4" />
          See recently signed
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto p-4 sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Recently signed</SheetTitle>
          <SheetDescription>
            Preview or download completed PDFs. Search by signer name or email.
          </SheetDescription>
        </SheetHeader>

        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search name or email"
            className="pl-9"
          />
        </div>

        {query.isError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            Could not load signed requests. You may need admin access.
          </p>
        )}

        <div className="mt-5 space-y-4">
          {requests.map((item) => {
            const isPreviewOpen = previewToken === item.tokenNumber;

            return (
              <article
                key={item.tokenNumber}
                className="rounded-lg border p-4"
              >
                <p className="font-medium">
                  {item.signerName || "Name not provided"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {item.signerEmail || "Email not provided"}
                </p>

                <p className="mt-2 text-sm">
                  {item.pdfFileName || "PDF document"}
                </p>

                {item.signedAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Signed {new Date(item.signedAt).toLocaleString()}
                  </p>
                )}

                {item.hasSignedPdf ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => togglePreview(item.tokenNumber)}
                    >
                      {isPreviewOpen ? "Hide signed PDF" : "View signed PDF"}
                    </Button>

                    <Button asChild size="sm">
                      <a
                        href={signedPdfUrl(item.tokenNumber, true)}
                        download
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download signed PDF
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    The signed PDF isn’t available for this request.
                  </p>
                )}

                {isPreviewOpen && item.hasSignedPdf && (
                  <div className="mt-4 overflow-hidden rounded-md border">
                    <iframe
                      src={signedPdfUrl(item.tokenNumber)}
                      title={`Signed PDF: ${item.pdfFileName || "Document"}`}
                      className="h-[65vh] w-full bg-white"
                    />
                  </div>
                )}
              </article>
            );
          })}

          {(query.isLoading || query.isFetching) && requests.length === 0 && (
            <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </p>
          )}

          {!query.isLoading &&
            !query.isFetching &&
            !query.isError &&
            requests.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No signed documents found.
              </p>
            )}

          {loadMoreError && (
            <p role="alert" className="text-sm text-destructive">
              {loadMoreError}
            </p>
          )}

          {hasMore && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoadingMore}
              onClick={() => void loadMore()}
            >
              {isLoadingMore ? "Loading…" : "Load more"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}