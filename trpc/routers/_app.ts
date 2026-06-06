import { z } from "zod";
import { createTRPCRouter } from "../init";
import { leadsRouter } from "./leads";
import { accessCodeRouter } from "./access";
export const appRouter = createTRPCRouter({
  leads: leadsRouter,
  accessCode: accessCodeRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
