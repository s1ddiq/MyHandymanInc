import AdminDashboard from "@/features/dashboard/AdminDashboard";
import { checkRole } from "@/lib/utils/roles";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await checkRole("admin")) || (await checkRole("sales_rep"))) {
    return (
      <main className="flex-1">
        {children}

        <div className="fixed bottom-6 right-6">
          <UserButton />
        </div>
      </main>
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
