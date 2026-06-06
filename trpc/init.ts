import { initTRPC, TRPCError } from "@trpc/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";

export type Role = "admin" | "sales_rep";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId } = await auth();

  let role: Role | null = null;

  if (userId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    role = (user.publicMetadata.role as Role) ?? null;
  }

  return {
    userId,
    role,
    headers: opts.headers,
    db: db,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      db: db,
    },
  });
});

const roleProcedure = (roles: Role[]) =>
  protectedProcedure.use(async ({ ctx, next }) => {
    if (!ctx.role || !roles.includes(ctx.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      });
    }

    return next();
  });

export const adminProcedure = roleProcedure(["admin"]);

export const salesRepProcedure = roleProcedure(["sales_rep"]);

export const staffProcedure = roleProcedure(["admin", "sales_rep"]);
