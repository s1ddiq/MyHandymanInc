"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LeadFormDialog } from "./components/LeadFormDialog";
import LeadRow from "./components/LeadRow";
import { Lead } from "@/lib/validators/lead";
import { useConfirmation } from "@/hooks/use-confirmation";
import { toast } from "sonner";

export default function AdminDashboard() {
  const trpc = useTRPC();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();

  const { confirm, ConfirmationDialog } = useConfirmation();

  const {
    data: leads,
    isLoading,
    error,
    refetch,
  } = useQuery(trpc.leads.getPublic.queryOptions());

  const deleteMutation = useMutation(
    trpc.leads.delete.mutationOptions({
      onSuccess: () => {
        refetch();
        toast.success("Lead deleted successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message ?? "Failed to delete lead");
      },
    }),
  );

  const handleDelete = (lead: Lead) => {
    confirm({
      title: "Delete lead",
      description: `Delete "${lead.name}"? This cannot be undone.`,
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMutation.mutateAsync({ id: lead.id });
      },
    });
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedLead(undefined);
    setIsDialogOpen(true);
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Manage leads, track requests, and update statuses.
            </p>
          </div>

          <Button onClick={handleCreateClick}>Create Lead</Button>
        </div>

        {/* Dialog */}
        <LeadFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          lead={selectedLead}
        />

        {/* Content */}
        <div className="space-y-4">
          {isLoading && (
            <div className="text-sm text-muted-foreground">
              Loading leads...
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500">Failed to load leads</div>
          )}

          {!isLoading && leads?.length === 0 && (
            <div className="rounded-lg border bg-background p-10 text-center">
              <p className="text-sm text-muted-foreground">No leads found</p>

              <Button
                className="mt-4"
                variant="secondary"
                onClick={handleCreateClick}
              >
                Create your first lead
              </Button>
            </div>
          )}

          {leads?.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              onEdit={() => handleEditClick(lead)}
              onDelete={() => handleDelete(lead)}
            />
          ))}
        </div>

        <ConfirmationDialog />
      </div>
    </main>
  );
}
