"use client";

import dynamic from "next/dynamic";
import type { SignatureBox } from "@/lib/signing/signature-box";

type Props = {
  file: File;
  onCancel: () => void;
  onConfirm: (box: SignatureBox) => void;
};

// @ts-ignore
const SignatureBoxEditor = dynamic<Props>(
  // @ts-ignore
  () => import("./SignatureBoxEditorClient"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        Loading PDF preview…
      </div>
    ),
  },
);

export default SignatureBoxEditor;
