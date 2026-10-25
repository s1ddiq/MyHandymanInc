import { z } from "zod";
import { createTRPCRouter } from "../init";
import { leadsRouter } from "./leads";
import { accessCodeRouter } from "./access";
import { teamChatRouter } from "./teamChat";
import { signingRequestsRouter } from "./signing-requests";
export const appRouter = createTRPCRouter({
  leads: leadsRouter,
  accessCode: accessCodeRouter,
  teamChat: teamChatRouter,
  signingRequests: signingRequestsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
