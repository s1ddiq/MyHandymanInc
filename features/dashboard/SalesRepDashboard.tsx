// features/dashboard/SalesRepDashboard.tsx
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import LeadRow from "./components/LeadRow";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirmation } from "@/hooks/use-confirmation";
import { ChevronLeft, ChevronRight, Smile } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const SalesRepDashboard = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedLeadForView, setSelectedLeadForView] = useState<any | null>(
    null,
  );

  const {
    data: leads,
    isLoading,
    error,
    refetch,
  } = useQuery(trpc.leads.getPublic.queryOptions());

  // Only show active leads (not submitted yet)
  const activeLeads =
    leads?.filter((lead) => lead.status !== "Submitted") || [];

  const submitMutation = useMutation(
    trpc.leads.submit.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Lead submitted successfully");
        router.refresh();
        setSelectedLeadForView(null); // Clear selected lead after submit
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

  const handleLeadClick = (lead: any) => {
    setSelectedLeadForView(lead);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-muted/30 w-full items-center justify-center">
        <div>Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-muted/30 w-full items-center justify-center">
        <div>Error loading leads: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/30 w-full">
      <div className="mx-auto max-w-7xl w-full md:flex">
        {/* Collapsible Sidebar - Only Active Leads */}
        <div
          className={cn(
            "bg-background border-x transition-all duration-300 flex flex-col",
            !isSidebarCollapsed ? "md:w-[300px] w-full" : "w-[80px]",
          )}
        >
          <div className="p-4 border-b flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="font-semibold text-lg">Active Leads</h2>
            )}
          </div>

          {!isSidebarCollapsed ? (
            <div className="flex-1 overflow-y-auto px-2 mt-2">
              {activeLeads.length === 0 && (
                <div className="text-sm text-muted-foreground p-4 text-center">
                  No active leads
                </div>
              )}
              {activeLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => handleLeadClick(lead)}
                  className={cn(
                    "p-3 mb-2 rounded-lg cursor-pointer transition-all hover:bg-primary/10",
                    selectedLeadForView?.id === lead.id &&
                      "bg-primary/10 border-l-4 border-primary",
                  )}
                >
                  <p className="font-medium text-sm truncate">{lead.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {lead.service}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(lead.created_at)} ago
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto py-4">
              {activeLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => handleLeadClick(lead)}
                  className={cn(
                    "w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground",
                    selectedLeadForView?.id === lead.id &&
                      "bg-primary text-primary-foreground",
                  )}
                  title={lead.name}
                >
                  <span className="text-sm font-medium">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content - Lead Viewer */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {selectedLeadForView ? (
              <LeadRow
                lead={selectedLeadForView}
                forSalesRep={true}
                onSubmit={(data) => handleSubmit(selectedLeadForView.id, data)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-background rounded-lg border">
                <Smile className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Select a lead to view
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on any lead from the sidebar to see details here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog />
    </div>
  );
};

export default SalesRepDashboard;
