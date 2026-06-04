import AdminDashboard from "@/features/dashboard/AdminDashboard";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  // Prefetch leads data on the server
  prefetch(trpc.leads.getPublic.queryOptions());

  return (
    <HydrateClient>
      <AdminDashboard />
    </HydrateClient>
  );
};

export default Page;
