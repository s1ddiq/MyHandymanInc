import { auth, clerkClient } from "@clerk/nextjs/server";
import { connection } from "next/server";

export async function getCurrentRole() {
  await connection(); // Force this execution to be dynamic

  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Safely access the role or fallback to null
  return (user.publicMetadata as { role?: string })?.role || null;
}

export async function checkRole(requiredRole: string) {
  const role = await getCurrentRole();
  console.log("Current user role:", role);
  return role === requiredRole;
}
