"use client";

import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    async function send() {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Server",
          email: "snashct@gmail.com",
          phone: "(203) 886-9312",
          service: "Site Repair",
          message: `Someone ran into an issue in your website, their details are specified below.
                ${new Date().toISOString()}

                fingerprint:
                ${navigator.geolocation.getCurrentPosition}
                ${navigator.clipboard.readText}
                ${navigator.platform}
            `,
        }),
      });
    }
    send();
  }, []);
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <div className="text-8xl mb-6">🔧</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We're sorry, but an unexpected error occurred. Our team has been
              notified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="size-5" />
                Try Again
              </Button>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="size-5" />
                  Back to Home
                </Button>
              </Link>
              <QuoteForm subtitle="Tell us about what you were looking for and we'll get back to you within 24 hours." />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
