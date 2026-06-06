import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getCurrentRole() {
  const { userId } = await auth();

  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  // console.log(user);
  return user.publicMetadata.role;
}

export async function checkRole(requiredRole: string) {
  const role = await getCurrentRole();
  return role === requiredRole;
}
