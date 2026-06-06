"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const ProtectedNavbar = () => {
  return (
    <header className="bg-primary py-2 sticky top-0 z-50 flex-center">
      <div className="mx-auto flex items-center justify-between gap-4 w-full max-w-7xl">
        {/* Logo - Left */}
        <div className="shrink-0">
          <Link
            href="/dashboard"
            className="text-base sm:text-lg md:text-xl font-bold text-primary-foreground hover:opacity-80 transition-opacity flex gap-3 items-center p-3"
          >
            <Image
              src="/favicon.ico"
              alt="Company Logo"
              width={32}
              height={32}
            />
            <p className="font-bold">MyHandymanInc</p>
          </Link>
        </div>

        {/* User Button - Right */}
        <div className="flex gap-2 sm:gap-3 shrink-0 items-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default ProtectedNavbar;
