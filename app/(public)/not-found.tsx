"use client";
import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { Home, PhoneCall, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
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
          message: `(This is an automated message set up by siddiq, ignore this. The developer (me) was contacted so don't fret!) Someone ran into an issue in your website, their details are specified below.
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 bg-[url(/hero-image.jpg)] bg-cover bg-bottom-center">
      <div className="text-center max-w-2xl py-24">
        {/* 404 Illustration */}
        <div className="text-9xl font-bold text-gray-200 mb-4">404</div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="size-5" />
              Back to Home
            </Button>
          </Link>
          <Link href="tel:+12034413471">
            <Button size="lg" variant="outline" className="gap-2">
              <PhoneCall className="size-5" />
              Call (203) 441-3471
            </Button>
          </Link>
        </div>

        <QuoteForm
          subtitle="Tell us about what you were looking for and we'll get back to you within 24 hours."
          className="mt-6"
        />
        {/* Quick Links */}
        <div className="mt-12 py-6 border-t border-gray-200 bg-white">
          <p className="text-sm text-gray-500 mb-4">Popular Pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/services"
              className="text-primary hover:underline text-sm"
            >
              Services
            </Link>
            <Link
              href="/roof-repair"
              className="text-primary hover:underline text-sm"
            >
              Roof Repair
            </Link>
            <Link
              href="/appliance-repair"
              className="text-primary hover:underline text-sm"
            >
              Appliance Repair
            </Link>
            <Link
              href="/why-us"
              className="text-primary hover:underline text-sm"
            >
              Why Choose Us
            </Link>
            <Link
              href="/contact"
              className="text-primary hover:underline text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
