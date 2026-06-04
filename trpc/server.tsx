// trpc/server.ts
import "server-only";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: async () =>
    createTRPCContext({
      headers: await headers(),
    }),
  router: appRouter,
  queryClient: getQueryClient,
});

// ✅ FIXED: Generic prefetch that works with ANY tRPC query
export function prefetch<TQueryFnReturnType>(queryOptions: TQueryFnReturnType) {
  const queryClient = getQueryClient();

  // Check if it's an infinite query by looking for a 'type' property
  const isInfinite =
    queryOptions &&
    typeof queryOptions === "object" &&
    "queryKey" in queryOptions &&
    Array.isArray(queryOptions.queryKey) &&
    queryOptions.queryKey[1]?.type === "infinite";

  if (isInfinite) {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions as any);
  }
}

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
