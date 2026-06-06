"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import React from "react";
import LeadRow from "./components/LeadRow";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirmation } from "@/hooks/use-confirmation";

const SalesRepDashboard = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const {
    data: leads,
    isLoading,
    error,
    refetch,
  } = useQuery(trpc.leads.getPublic.queryOptions());

  // Use the new submit mutation
  const submitMutation = useMutation(
    trpc.leads.submit.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Lead submitted successfully");
        router.refresh();
      },
      onError: (error: any) => {
        if (error.data?.code === "FORBIDDEN") {
          toast.error("You don't have permission to submit leads");
          return;
        }
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Please sign in to submit leads");
          router.push("/sign-in");
          return;
        }
        toast.error(error?.message ?? "Failed to submit lead");
      },
    }),
  );

  const handleSubmit = (
    leadId: number,
    data: { notes: string; appointment: Date },
  ) => {
    confirm({
      title: "Submit Lead",
      description: `Are you sure you want to submit this lead with appointment on ${data.appointment.toLocaleDateString()} at ${data.appointment.toLocaleTimeString()}? This will mark the lead as submitted and it will be removed from your dashboard.`,
      confirmText: "Submit",
      variant: "default",
      onConfirm: async () => {
        await submitMutation.mutateAsync({
          id: leadId,
          notes: data.notes,
          appointment: data.appointment.toISOString(),
        });
      },
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-6xl p-6 space-y-6">
          <div>Loading leads...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-6xl p-6 space-y-6">
          <div>Error loading leads: {error.message}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sales Representative
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Submit leads, make calls, and provide important notes.
            </p>
          </div>
        </div>
        {leads?.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            forSalesRep={true}
            onSubmit={(data) => handleSubmit(lead.id, data)}
          />
        ))}

        {/* Add the ConfirmationDialog component */}
        <ConfirmationDialog />
      </div>
    </main>
  );
};

export default SalesRepDashboard;
