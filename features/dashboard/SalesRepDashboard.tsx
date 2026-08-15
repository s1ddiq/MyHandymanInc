"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { LeadFormDialog } from "./components/LeadFormDialog";
import LeadRow from "./components/LeadRow";
import { Lead } from "@/lib/validators/lead";
import { useConfirmation } from "@/hooks/use-confirmation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  CalendarCheck,
  Inbox,
  UserCheck,
  Plus,
  Trash,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function SalesRepDashboard() {
  const trpc = useTRPC();
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined);
  const [selectedLeadForView, setSelectedLeadForView] = useState<Lead | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: allLeads,
    refetch,
    isLoading,
  } = useQuery(trpc.leads.getPublic.queryOptions());

  const submitMutation = useMutation(
    trpc.leads.submit.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Lead submitted successfully");
        router.refresh();
        setSelectedLeadForView(null);
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

  const deleteMutation = useMutation(
    trpc.leads.delete.mutationOptions({
      onSuccess() {
        toast.success("Lead deleted successfully.");
        refetch();
        setSelectedLeadForView(null);
      },
      onError(e: any) {
        toast.error(e.message || "Failed to delete lead.");
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.leads.update.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Lead updated successfully");
        setIsDialogOpen(false);
        setSelectedLeadForView(null);
      },
      onError: (error: any) => {
        toast.error(error?.message ?? "Failed to update lead");
      },
    }),
  );

  const createMutation = useMutation(
    trpc.leads.create.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Lead created successfully");
        setIsDialogOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        if (error.data?.code === "FORBIDDEN") {
          toast.error("You don't have permission to create leads");
          return;
        }
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Please sign in to create leads");
          router.push("/sign-in");
          return;
        }
        toast.error(error?.message ?? "Failed to create lead");
      },
    }),
  );

  function sortLeads(leads: Lead[]) {
    return [...leads].sort((a, b) => {
      const aBooked = !!a.appointment;
      const bBooked = !!b.appointment;

      if (aBooked !== bBooked) {
        return aBooked ? -1 : 1;
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }

  // Only show active leads (not submitted yet)
  const activeLeads = useMemo(() => {
    return sortLeads(
      (allLeads ?? [])
        .filter((x) => x.status !== "Submitted")
        .filter((x) =>
          [x.name, x.service, x.phone, x.email]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    );
  }, [allLeads, search]);

  const bookedCount = activeLeads?.filter((x) => x.appointment).length ?? 0;

  const handleSubmit = (
    leadId: number,
    data: { notes: string; appointment?: Date },
  ) => {
    confirm({
      title: "Submit Lead",
      description: `Are you sure you want to submit this lead${data.appointment ? ` with appointment on ${data.appointment.toLocaleDateString()} at ${data.appointment.toLocaleTimeString()}` : ""}? This will mark the lead as submitted.`,
      confirmText: "Submit",
      variant: "default",
      onConfirm: async () => {
        await submitMutation.mutateAsync({
          id: leadId,
          notes: data.notes,
          appointment: data.appointment?.toISOString(),
        });
        setSelectedLeadForView(null);
      },
    });
  };

  const handleDelete = (lead: Lead) => {
    confirm({
      title: "Delete Lead",
      description: `Are you sure you want to delete ${lead.name}? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMutation.mutateAsync({
          id: lead.id,
        });
      },
    });
  };

  const handleCreateLead = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateLead = async (data: any) => {
    if (selectedLead) {
      await updateMutation.mutateAsync({
        id: selectedLead.id,
        data: data,
      });
    }
  };

  const handleCloseCurrentLead = () => {
    if (selectedLeadForView) {
      confirm({
        title: "Close Current Lead",
        description: `Are you sure you want to close ${selectedLeadForView.name}'s lead? This will return to the dashboard view.`,
        confirmText: "Close",
        variant: "default",
        onConfirm: () => {
          setSelectedLeadForView(null);
          toast.info("Lead view closed");
        },
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Data refreshed");
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3 py-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-2xl border animate-pulse bg-muted/30"
        />
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12 text-muted-foreground">
      <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p>No active leads found</p>
      <p className="text-xs mt-1">New customer inquiries will appear here</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => {
          setSelectedLead(undefined);
          setIsDialogOpen(true);
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create First Lead
      </Button>
    </div>
  );

  return (
    <div className="max-h-screen bg-muted/20 dark:bg-zinc-950 overflow-y-auto">
      <div className="h-full mx-auto p-6">
        <div className="grid xl:grid-cols-[370px_1fr] gap-6 h-full">
          {/* SIDEBAR */}
          <div className="rounded-3xl border bg-background dark:bg-zinc-900 overflow-hidden max-h-[calc(100vh-72px)] flex flex-col">
            <div className="p-5 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 pr-10 rounded-xl"
                  placeholder="Search active leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg">Active Leads</h2>
                  <Badge variant="secondary">{activeLeads.length}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isLoading}
                >
                  <RefreshCw
                    className={cn(
                      "h-4 w-4",
                      (isRefreshing || isLoading) && "animate-spin",
                    )}
                  />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {isLoading ? (
                <LoadingSkeleton />
              ) : activeLeads.length === 0 ? (
                <EmptyState />
              ) : (
                activeLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadForView(lead)}
                    className={cn(
                      "rounded-2xl border p-4 my-3 cursor-pointer transition-all hover:shadow-lg hover:border-primary",
                      lead.appointment &&
                        "border-l-4 border-l-green-500 bg-green-500/5",
                      selectedLeadForView?.id === lead.id &&
                        "border-l border-primary bg-primary/5",
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{lead.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {lead.service}
                        </p>
                        {lead.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {lead.email}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                        {lead.appointment && (
                          <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs">
                            Booked
                          </Badge>
                        )}
                        {lead.status && lead.status !== "active" && (
                          <Badge
                            className={cn(
                              "text-xs",
                              lead.status === "won" &&
                                "bg-blue-600 hover:bg-blue-600 text-white",
                              lead.status === "lost" &&
                                "bg-red-600 hover:bg-red-600 text-white",
                              lead.status === "contacted" &&
                                "bg-yellow-600 hover:bg-yellow-600 text-white",
                            )}
                          >
                            {lead.status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {lead.appointment && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Appointment Scheduled</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(lead.created_at))} ago
                      </p>
                      {lead.updated_at &&
                        lead.updated_at !== lead.created_at && (
                          <p className="text-xs text-muted-foreground">
                            Updated{" "}
                            {formatDistanceToNow(new Date(lead.updated_at))} ago
                          </p>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-3 border-t bg-muted/10">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Total: {allLeads?.length ?? 0}</span>
                <span>Booked: {bookedCount}</span>
                <span>Active: {activeLeads.length}</span>
              </div>
            </div>
          </div>

          {/* DETAILS PANEL */}
          <div className="flex flex-col h-full min-h-0">
            {/* Header */}
            <div
              className={cn(
                "rounded-3xl border bg-background dark:bg-zinc-900 pb-3 flex-shrink-0",
                selectedLeadForView ? "pb-2" : "",
              )}
            >
              <div
                className={cn(
                  "flex flex-col lg:flex-row justify-between gap-4 px-6 pt-6",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1
                      className={cn(
                        "font-bold mt-1 truncate",
                        selectedLeadForView ? "text-2xl" : "text-3xl",
                      )}
                    >
                      Sales Dashboard
                    </h1>
                    <Badge className="bg-blue-500 text-xs align-middle flex-shrink-0">
                      Sales Rep
                    </Badge>
                  </div>
                  {!selectedLeadForView && (
                    <p className="text-muted-foreground mt-2">
                      Manage active leads, schedule appointments, and submit
                      completed consultations.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  {/* Create Lead Button */}
                  <Button
                    size="lg"
                    onClick={() => {
                      setSelectedLead(undefined);
                      setIsDialogOpen(true);
                    }}
                    className="min-w-[160px]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Lead
                  </Button>

                  {/* Close Current Lead Button - only shows when a lead is selected */}
                  {selectedLeadForView && (
                    <Button
                      onClick={handleCloseCurrentLead}
                      variant="destructive"
                      size="lg"
                      className="min-w-[160px]"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Close Current Lead
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick stats when lead is selected */}
              {selectedLeadForView && (
                <div className="px-6 pt-2 flex flex-wrap gap-4 text-sm text-muted-foreground border-t mt-3 pt-3">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    <span>
                      Created:{" "}
                      {formatDistanceToNow(
                        new Date(selectedLeadForView.created_at),
                      )}{" "}
                      ago
                    </span>
                  </div>
                  {selectedLeadForView.appointment && (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span>
                        Appointment:{" "}
                        {new Date(
                          selectedLeadForView.appointment,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedLeadForView.status &&
                    selectedLeadForView.status !== "active" && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Status: {selectedLeadForView.status}
                        </Badge>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Lead Details or Empty State */}
            <div className="flex-1 mt-6 min-h-0">
              {selectedLeadForView ? (
                <div className="rounded-3xl border bg-background dark:bg-zinc-900 h-full overflow-y-auto">
                  <LeadRow
                    lead={selectedLeadForView}
                    forSalesRep={true}
                    onEdit={() => handleEdit(selectedLeadForView)}
                    onDelete={() => handleDelete(selectedLeadForView)}
                    onSubmit={(data) =>
                      handleSubmit(selectedLeadForView.id, data)
                    }
                  />
                </div>
              ) : (
                <div className="rounded-3xl border bg-background dark:bg-zinc-900 h-full flex flex-col justify-center items-center p-8">
                  <UserCheck className="h-20 w-20 text-primary mb-4" />
                  <h2 className="text-3xl font-bold mt-6">No Lead Selected</h2>
                  <p className="text-muted-foreground mt-2 text-center max-w-md">
                    Select a customer from the left to view details, schedule
                    appointments, and manage their lead.
                  </p>
                  <div className="flex gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedLead(undefined);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Lead
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw
                        className={cn(
                          "mr-2 h-4 w-4",
                          isRefreshing && "animate-spin",
                        )}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form Dialog */}
      <LeadFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        lead={selectedLead}
      />

      <ConfirmationDialog />
    </div>
  );
}
