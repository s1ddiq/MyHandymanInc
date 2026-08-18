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
    data: { notes: string; appointment?: Date; job_details?: string },
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
          job_details: data.job_details,
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
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-muted/20 dark:bg-zinc-950">
      <div className="flex min-h-0 w-full flex-col p-3 sm:p-4 lg:p-6">
        {/* Dashboard header */}
        <div className="mb-4 shrink-0 rounded-2xl border bg-background p-4 dark:bg-zinc-900 sm:rounded-3xl p-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Sales Dashboard
                </h1>

                <Badge className="bg-blue-500">Sales Rep</Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground sm:mt-2">
                Manage active leads, schedule appointments, and submit completed
                consultations.
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarCheck className="h-4 w-4 text-green-600" />
                <span>{bookedCount} booked</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 sm:flex-none"
                onClick={() => {
                  setSelectedLead(undefined);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Lead
              </Button>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="icon"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Main workspace */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* LEAD LIST */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-background dark:bg-zinc-900 lg:rounded-3xl">
            {/* Search */}
            <div className="shrink-0 border-b p-3 sm:p-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="rounded-xl pl-9 pr-9"
                  placeholder="Search active leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* List header */}
            <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Active Leads</h2>

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

            {/* ONLY THE LIST SCROLLS */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {isLoading ? (
                <LoadingSkeleton />
              ) : activeLeads.length === 0 ? (
                <EmptyState />
              ) : (
                activeLeads.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedLeadForView(lead)}
                    className={cn(
                      "mb-3 w-full rounded-2xl border p-4 text-left transition-all",
                      "hover:border-primary hover:shadow-md",
                      selectedLeadForView?.id === lead.id &&
                        "border-primary bg-primary/5 shadow-sm",
                      lead.appointment &&
                        "border-l-4 border-l-green-500 bg-green-500/5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold">{lead.name}</h3>

                        <p className="truncate text-xs text-muted-foreground">
                          {lead.service}
                        </p>

                        {lead.email && (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {lead.email}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {lead.appointment && (
                          <Badge className="bg-green-600 text-xs text-white hover:bg-green-600">
                            Booked
                          </Badge>
                        )}

                        {lead.status && lead.status !== "active" && (
                          <Badge
                            className={cn(
                              "text-xs",
                              lead.status === "Submitted" &&
                                "bg-blue-600 text-white hover:bg-blue-600",
                              lead.status === "Potential" &&
                                "bg-yellow-500 text-white hover:bg-yellow-500",
                              lead.status === "Contacted" &&
                                "bg-orange-500 text-white hover:bg-orange-500",
                              lead.status === "Qualified" &&
                                "bg-purple-500 text-white hover:bg-purple-500",
                              lead.status === "Proposal" &&
                                "bg-indigo-500 text-white hover:bg-indigo-500",
                              lead.status === "Negotiation" &&
                                "bg-pink-500 text-white hover:bg-pink-500",
                              lead.status === "Won" &&
                                "bg-emerald-600 text-white hover:bg-emerald-600",
                              lead.status === "Lost" &&
                                "bg-red-500 text-white hover:bg-red-500",
                            )}
                          >
                            {lead.status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {lead.appointment && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        Appointment Scheduled
                      </div>
                    )}

                    <div className="mt-3 flex justify-between gap-2 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(lead.created_at))} ago
                      </span>

                      {lead.updated_at !== lead.created_at && (
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(new Date(lead.updated_at))} ago
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t bg-muted/10 p-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Total: {allLeads?.length ?? 0}</span>
                <span>Booked: {bookedCount}</span>
                <span>Active: {activeLeads.length}</span>
              </div>
            </div>
          </section>

          {/* DETAILS */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-background dark:bg-zinc-900 lg:rounded-3xl">
            {/* Details header */}
            <div className="shrink-0 border-b p-4 sm:p-6">
              {selectedLeadForView ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-bold sm:text-2xl">
                      {selectedLeadForView.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedLeadForView.service}
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCloseCurrentLead}
                    className="shrink-0"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Close
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Lead Details
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Select a lead to view its details.
                  </p>
                </div>
              )}
            </div>

            {/* IMPORTANT:
              this is the ONLY scroll container for LeadRow
          */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {selectedLeadForView ? (
                <LeadRow
                  lead={selectedLeadForView}
                  forSalesRep
                  onEdit={() => handleEdit(selectedLeadForView)}
                  onDelete={() => handleDelete(selectedLeadForView)}
                  onSubmit={(data) =>
                    handleSubmit(selectedLeadForView.id, data)
                  }
                />
              ) : (
                <div className="flex min-h-full flex-col items-center justify-center p-8 text-center">
                  <UserCheck className="h-16 w-16 text-primary sm:h-20 sm:w-20" />

                  <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
                    No Lead Selected
                  </h2>

                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Select a customer from the left to view details, schedule
                    appointments, and manage their lead.
                  </p>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
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
          </section>
        </div>
      </div>

      <LeadFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        lead={selectedLead}
      />

      <ConfirmationDialog />
    </div>
  );
}
