import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getCurrentRole() {
  const { userId } = await auth();

  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return user.publicMetadata.role;
}

export const checkRole = (requiredRole: string) => {
  return async (req: Request) => {
    const role = await getCurrentRole();
    return role === requiredRole;
  };
};
