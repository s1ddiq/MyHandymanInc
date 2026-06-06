import SalesRepDashboard from "@/features/dashboard/SalesRepDashboard";
import { checkRole } from "@/lib/utils/roles";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";

const Page = async () => {
  if (!(await checkRole("sales_rep"))) redirect("/404");
  // Prefetch leads data on the server
  prefetch(trpc.leads.getPublic.queryOptions());

  return (
    <HydrateClient>
      <SalesRepDashboard />
    </HydrateClient>
  );
};

export default Page;
