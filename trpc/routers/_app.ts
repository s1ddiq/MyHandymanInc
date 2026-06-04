import { z } from "zod";
import { createTRPCRouter } from "../init";
import { leadsRouter } from "./leads";
export const appRouter = createTRPCRouter({
  leads: leadsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
