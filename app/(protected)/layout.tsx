import ProtectedNavbar from "@/features/dashboard/components/ProtectedNavbar";
import TeamChat from "@/features/dashboard/components/TeamChat";
import { checkRole } from "@/lib/utils/roles";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allowed = (await checkRole("admin")) || (await checkRole("sales_rep"));

  if (!allowed) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 p-4">
        <h1 className="mb-4 text-center text-3xl font-semibold text-white">
          Access Denied
        </h1>

        <p className="text-center text-gray-300">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <SidebarProvider className="w-screen md:h-screen h-dvh">
      <ProtectedNavbar>
        <div className="flex h-full">
          {/* Main content area */}
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

          {/* Desktop chat - TeamChat component handles mobile floating button */}
          <TeamChat />
        </div>
      </ProtectedNavbar>
    </SidebarProvider>
  );
}
