import ProtectedNavbar from "@/features/dashboard/components/ProtectedNavbar";
import { checkRole } from "@/lib/utils/roles";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await checkRole("admin")) || (await checkRole("sales_rep"))) {
    return (
      <>
        <ProtectedNavbar />
        <main className="flex-1">{children}</main>
      </>
    );
  } else {
    return (
      <div className="p-4 h-screen w-full flex flex-col items-center justify-center bg-gray-800">
        <h1 className="text-3xl mb-4 text-center font-semibold text-white">
          Access Denied
        </h1>
        <p className="text-center text-gray-300">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }
}
