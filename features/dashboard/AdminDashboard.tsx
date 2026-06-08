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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  CalendarCheck,
  Clock3,
  Inbox,
  Smile,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const trpc = useTRPC();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead>();
  const [selectedLeadForView, setSelectedLeadForView] = useState<Lead | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState("active");
  const [search, setSearch] = useState("");

  const { confirm, ConfirmationDialog } = useConfirmation();

  const { data: allLeads, refetch } = useQuery(
    trpc.leads.getPublic.queryOptions(),
  );

  const deleteMutation = useMutation(
    trpc.leads.delete.mutationOptions({
      onSuccess() {
        toast.success("Lead deleted.");
        refetch();
      },
      onError(e: any) {
        toast.error(e.message);
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

  const activeLeads = useMemo(() => {
    return sortLeads(
      (allLeads ?? [])
        .filter((x) => x.status !== "Submitted")
        .filter((x) =>
          [x.name, x.service, x.phone]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    );
  }, [allLeads, search]);

  const submittedLeads = useMemo(() => {
    return sortLeads(
      (allLeads ?? [])
        .filter((x) => x.status === "Submitted")
        .filter((x) =>
          [x.name, x.service, x.phone]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    );
  }, [allLeads, search]);

  const bookedCount = allLeads?.filter((x) => x.appointment).length ?? 0;

  const handleDelete = (lead: Lead) => {
    confirm({
      title: "Delete lead",
      description: `Delete ${lead.name}?`,
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMutation.mutateAsync({
          id: lead.id,
        });
      },
    });
  };

  return (
    <div className="min-h-screen  bg-muted/20 dark:bg-zinc-950">
      <div className="mx-auto p-6">
        {/* HERO */}

        {/* STATS */}

        {/* <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active"
            value={activeLeads.length}
            icon={<Inbox className="h-5 w-5" />}
          />

          <StatCard
            title="Booked"
            value={bookedCount}
            icon={<CalendarCheck className="h-5 w-5 text-green-600" />}
          />

          <StatCard
            title="Submitted"
            value={submittedLeads.length}
            icon={<Clock3 className="h-5 w-5" />}
          />

          <StatCard
            title="Total"
            value={allLeads?.length ?? 0}
            icon={<Inbox className="h-5 w-5" />}
          />
        </div> */}

        <div className="grid xl:grid-cols-[370px_1fr] gap-6">
          {/* SIDEBAR */}

          <div className="rounded-3xl border bg-background dark:bg-zinc-900 overflow-hidden h-fit sticky top-24">
            <div className="p-5 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-9 rounded-xl"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full rounded-xl">
                  <TabsTrigger value="active">
                    Active
                    <Badge className="ml-2 ">{activeLeads.length}</Badge>
                  </TabsTrigger>

                  <TabsTrigger value="submitted">
                    Submitted
                    <Badge className="ml-2">{submittedLeads.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="max-h-[73vh] overflow-y-auto px-3 pb-3">
              {(activeTab === "active" ? activeLeads : submittedLeads).map(
                (lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadForView(lead)}
                    className={cn(
                      "rounded-2xl border p-4 mb-3 cursor-pointer transition-all hover:shadow-lg hover:border-primary",

                      lead.appointment &&
                        "border-l-4 border-l-green-500 bg-green-500/5",

                      selectedLeadForView?.id === lead.id &&
                        "border-l border-primary bg-primary/5",
                    )}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>

                        <p className="text-xs text-muted-foreground">
                          {lead.service}
                        </p>
                      </div>

                      {lead.appointment && (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white">
                          Booked
                        </Badge>
                      )}
                    </div>

                    {lead.appointment && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Appointment Scheduled
                      </div>
                    )}

                    <p className="text-xs mt-3 text-muted-foreground">
                      {formatDistanceToNow(new Date(lead.created_at))} ago
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* DETAILS */}

          <div className="flex flex-col">
            <div className="rounded-3xl bordefr bg-background dark:bg-zinc-900 pb-3">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mt-1">Lead Dashboard</h1>

                  <p className="text-muted-foreground mt-2">
                    Manage customers, appointments and estimates.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="lg"
                    onClick={() => {
                      setSelectedLead(undefined);
                      setIsDialogOpen(true);
                    }}
                    className="min-w-48"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Lead
                  </Button>
                  {selectedLeadForView && (
                    <Button
                      onClick={() => setSelectedLeadForView(null)}
                      variant="destructive"
                      size="lg"
                      className="min-w-48"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Close Current Lead
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {selectedLeadForView ? (
              <LeadRow
                lead={selectedLeadForView}
                onEdit={() => {
                  setSelectedLead(selectedLeadForView);
                  setIsDialogOpen(true);
                }}
                onDelete={() => handleDelete(selectedLeadForView)}
              />
            ) : (
              <div className="rounded-3xl border bg-background dark:bg-zinc-900 min-h-[700px] flex flex-col justify-center items-center">
                <Smile className="h-20 w-20 text-primary" />

                <h2 className="text-3xl font-bold mt-6">No Lead Selected</h2>

                <p className="text-muted-foreground mt-2">
                  Select a customer from the left to view details.
                </p>
              </div>
            )}
          </div>
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

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-background dark:bg-zinc-900 p-6 hover:shadow-lg transition">
      <div className="flex justify-between">
        <span className="text-muted-foreground text-sm">{title}</span>

        {icon}
      </div>

      <div className="text-4xl font-bold mt-4">{value}</div>
    </div>
  );
}
