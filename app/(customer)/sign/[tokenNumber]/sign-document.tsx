"use client";

import dynamic from "next/dynamic";
import type { SignatureBox } from "@/lib/signing/signature-box";

type Props = {
  tokenNumber: number;
  pdfUrl: string;
  fileName: string;
  signerName: string;
  signatureBox: SignatureBox | null;
};

// @ts-ignore
const SignDocument = dynamic<Props>(() => import("./sign-document-client"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-dvh items-center justify-center">
      Loading signing interface…
    </main>
  ),
});

export default SignDocument;
