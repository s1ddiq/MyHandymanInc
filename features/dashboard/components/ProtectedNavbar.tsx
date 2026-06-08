"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "@wrksz/themes/client";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProtectedNavbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-primary py-2 w-full sticky top-0 z-50 flex-center">
      <div className="flex items-center justify-between gap-4 w-full px-4">
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

        {/* User Button & Theme Switcher - Right */}
        <div className="flex gap-2 sm:gap-3 shrink-0 items-center">
          {/* Theme Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                {theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default ProtectedNavbar;
