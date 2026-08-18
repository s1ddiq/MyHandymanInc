"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { LeadFormDialog } from "./components/LeadFormDialog";
import LeadRow from "./components/LeadRow";
import { Lead } from "@/lib/validators/lead";
import { useConfirmation } from "@/hooks/use-confirmation";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  CalendarCheck,
  Inbox,
  Smile,
  Trash,
  X,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type LeadTab = "active" | "submitted";

export default function AdminDashboard() {
  const trpc = useTRPC();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [selectedLeadForView, setSelectedLeadForView] = useState<Lead | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<LeadTab>("active");
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { confirm, ConfirmationDialog } = useConfirmation();

  const {
    data: allLeads = [],
    isLoading,
    refetch,
  } = useQuery(trpc.leads.getPublic.queryOptions());

  const deleteMutation = useMutation(
    trpc.leads.delete.mutationOptions({
      onSuccess: async () => {
        await refetch();
        setSelectedLeadForView(null);
        toast.success("Lead deleted.");
      },
      onError: (error) => {
        toast.error(error.message);
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

  const sortLeads = (leads: Lead[]) =>
    [...leads].sort((a, b) => {
      const aBooked = Boolean(a.appointment);
      const bBooked = Boolean(b.appointment);

      if (aBooked !== bBooked) {
        return aBooked ? -1 : 1;
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const matchesSearch = (lead: Lead) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      lead.name,
      lead.service,
      lead.phone,
      lead.email,
      lead.location,
      lead.status,
      lead.job_details,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  };

  const activeLeads = useMemo(
    () =>
      sortLeads(
        allLeads
          .filter((lead) => lead.status !== "Submitted")
          .filter(matchesSearch),
      ),
    [allLeads, search],
  );

  const submittedLeads = useMemo(
    () =>
      sortLeads(
        allLeads
          .filter((lead) => lead.status === "Submitted")
          .filter(matchesSearch),
      ),
    [allLeads, search],
  );

  const currentList = activeTab === "active" ? activeLeads : submittedLeads;

  const bookedCount = allLeads.filter((lead) =>
    Boolean(lead.appointment),
  ).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await refetch();
      toast.success("Data refreshed.");
    } catch {
      toast.error("Failed to refresh leads.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = (lead: Lead) => {
    confirm({
      title: "Delete lead",
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

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleCloseLead = () => {
    setSelectedLeadForView(null);
  };

  const openCreateDialog = () => {
    setSelectedLead(undefined);
    setIsDialogOpen(true);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3 py-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-2xl border animate-pulse bg-muted/30"
        />
      ))}
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-muted/20 dark:bg-zinc-950">
      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4 lg:p-5">
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* LEADS */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-background dark:bg-zinc-900">
            {/* SEARCH */}
            <div className="shrink-0 border-b p-3 sm:p-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search leads..."
                  className="pl-9 pr-9"
                />

                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setSearch("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* TABS */}
            <div className="shrink-0 border-b p-3 sm:p-4">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as LeadTab)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">
                    Active
                    <Badge variant="secondary" className="ml-2">
                      {activeLeads.length}
                    </Badge>
                  </TabsTrigger>

                  <TabsTrigger value="submitted">
                    Submitted
                    <Badge variant="secondary" className="ml-2">
                      {submittedLeads.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* LIST HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                  {activeTab === "active" ? "Active Leads" : "Submitted Leads"}
                </h2>

                <Badge variant="secondary">{currentList.length}</Badge>
              </div>

              <Button
                variant="ghost"
                size="icon"
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

            {/* LEAD LIST */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {isLoading ? (
                <LoadingSkeleton />
              ) : currentList.length === 0 ? (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center px-4 text-center text-muted-foreground">
                  <Inbox className="mb-3 h-10 w-10 opacity-50" />

                  <p className="font-medium">No {activeTab} leads</p>

                  <p className="mt-1 text-xs">
                    {search
                      ? "Try changing your search."
                      : activeTab === "active"
                        ? "New customer inquiries will appear here."
                        : "Submitted leads will appear here."}
                  </p>

                  {!search && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={openCreateDialog}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Lead
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {currentList.map((lead) => (
                    <button
                      type="button"
                      key={lead.id}
                      onClick={() => setSelectedLeadForView(lead)}
                      className={cn(
                        "w-full rounded-xl border p-4 text-left transition-all",
                        "hover:border-primary hover:shadow-sm",
                        lead.appointment &&
                          "border-l-4 border-l-green-500 bg-green-500/5",
                        selectedLeadForView?.id === lead.id &&
                          "border-primary bg-primary/5",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold">
                            {lead.name}
                          </h3>

                          <p className="truncate text-xs text-muted-foreground">
                            {lead.service}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {lead.email}
                          </p>

                          {lead.phone && (
                            <p className="truncate text-xs text-muted-foreground">
                              {lead.phone}
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
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                          Appointment Scheduled
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(lead.created_at))} ago
                        </p>

                        {lead.status && (
                          <span className="truncate text-xs text-muted-foreground">
                            {lead.status}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STATS */}
            <div className="shrink-0 border-t bg-muted/10 p-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">
                    {allLeads.length}
                  </p>
                  <span>Total</span>
                </div>

                <div>
                  <p className="font-semibold text-foreground">{bookedCount}</p>
                  <span>Booked</span>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    {activeLeads.length}
                  </p>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILS */}
          <section className="flex min-h-0 flex-col overflow-hidden">
            {/* HEADER */}
            <div className="shrink-0 rounded-2xl border bg-background p-4 dark:bg-zinc-900 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 ">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                      Admin Dashboard
                    </h1>

                    <Badge className="bg-red-500">Admin</Badge>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground md:block hidden">
                    Manage customers, appointments, and leads.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-green-600" />
                      <span>{bookedCount} booked</span>
                    </div>

                    <div>
                      <span>{allLeads.length} total leads</span>
                    </div>

                    <div>
                      <span>{activeLeads.length} active</span>
                    </div>

                    <div>
                      <span>{submittedLeads.length} submitted</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Lead
                  </Button>

                  {selectedLeadForView && (
                    <Button variant="destructive" onClick={handleCloseLead}>
                      <X className="mr-2 h-4 w-4" />
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-4 min-h-0 flex-1 overflow-hidden">
              {selectedLeadForView ? (
                <div className="h-full overflow-y-auto rounded-2xl border bg-background p-4 dark:bg-zinc-900 sm:p-6">
                  <LeadRow
                    lead={selectedLeadForView}
                    onEdit={() => handleEdit(selectedLeadForView)}
                    onDelete={() => handleDelete(selectedLeadForView)}
                  />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border bg-background p-6 text-center dark:bg-zinc-900">
                  <UserCheck className="h-16 w-16 text-primary" />

                  <h2 className="mt-5 text-2xl font-bold">No Lead Selected</h2>

                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Select a lead from the list to view their complete customer
                    information, job details, appointment, and team notes.
                  </p>

                  <Button
                    className="mt-6"
                    variant="outline"
                    onClick={openCreateDialog}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Lead
                  </Button>
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
