import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "My Handyman Inc - Your Trusted Local Handyman & Home Improvement Experts in Connecticut",
  description:
    "My Handyman Inc is your go-to local handyman and home improvement company in Connecticut. Our top-rated professionals are ready to tackle all your home projects, big or small, on time and on budget. Contact us today for a free estimate and experience our guaranteed quality service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", roboto.className, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <HomeNavbar />
        {children}
        <CookieBanner />
        <HomeFooter />
      </body>
    </html>
  );
}
