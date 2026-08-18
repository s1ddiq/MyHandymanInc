import { z } from "zod";
import { createTRPCRouter } from "../init";
import { leadsRouter } from "./leads";
import { accessCodeRouter } from "./access";
import { teamChatRouter } from "./teamChat";
export const appRouter = createTRPCRouter({
  leads: leadsRouter,
  accessCode: accessCodeRouter,
  teamChat: teamChatRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
