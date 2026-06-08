"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Moon, Bell, Plus } from "lucide-react";

const ProtectedNavbar = () => {
  return (
    <header
      className="
      sticky top-0 z-50
      border-b
      bg-background/80
      backdrop-blur-xl
      supports-[backdrop-filter]:bg-background/60
      dark:bg-zinc-950/80
    "
    >
      <div className="mx-auto w-full px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* LEFT */}

        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center transition group-hover:scale-105">
            <Image src="/favicon.ico" alt="logo" width={34} height={34} />
          </div>

          <div className="hidden sm:block">
            <h1 className="font-bold text-xl leading-none">MyHandymanInc</h1>

            <p className="text-xs text-muted-foreground mt-1">
              Contractor CRM Dashboard
            </p>
          </div>
        </Link>

        {/* RIGHT */}

        <div className="flex items-center gap-3">
          {/* quick create */}

          <Button size="sm" className="hidden md:flex rounded-xl shadow">
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>

          {/* notification */}

          <Button size="icon" variant="ghost" className="rounded-xl relative">
            <Bell className="h-5 w-5" />

            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </Button>

          {/* dark mode */}

          <Button
            variant="ghost"
            size="icon"
            className="
            rounded-xl
            hover:bg-primary/10
          "
          >
            <Moon className="h-5 w-5" />
          </Button>

          <div className="border-l h-8 mx-1" />

          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 rounded-xl shadow-sm",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default ProtectedNavbar;

// import { useTheme } from "next-themes";
// import { Moon, Sun } from "lucide-react";

// const { theme, setTheme } = useTheme();

// <Button
//   variant="ghost"
//   size="icon"
//   className="rounded-xl"
//   onClick={() =>
//     setTheme(theme === "dark" ? "light" : "dark")
//   }
// >
//   {theme === "dark" ? (
//     <Sun className="h-5 w-5" />
//   ) : (
//     <Moon className="h-5 w-5" />
//   )}
// </Button>
