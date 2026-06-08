"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import LeadRow from "./components/LeadRow";
import { Lead } from "@/lib/validators/lead";
import { useConfirmation } from "@/hooks/use-confirmation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CalendarCheck, Clock3, Inbox, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function SalesRepDashboard() {
  const trpc = useTRPC();
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const [selectedLeadForView, setSelectedLeadForView] = useState<Lead | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const { data: allLeads, refetch } = useQuery(
    trpc.leads.getPublic.queryOptions(),
  );

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
          [x.name, x.service, x.phone]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    );
  }, [allLeads, search]);

  const bookedCount = activeLeads?.filter((x) => x.appointment).length ?? 0;

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

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-zinc-950">
      <div className="mx-auto p-6">
        <div className="grid xl:grid-cols-[370px_1fr] gap-6">
          {/* SIDEBAR */}
          <div className="rounded-3xl border bg-background dark:bg-zinc-900 overflow-hidden h-fit sticky top-24">
            <div className="p-5 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 rounded-xl"
                  placeholder="Search active leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Active Leads</h2>
                <Badge variant="secondary">{activeLeads.length}</Badge>
              </div>
            </div>

            <div className="max-h-[73vh] overflow-y-auto px-3 pb-3">
              {activeLeads.map((lead) => (
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
              ))}
              {activeLeads.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active leads found</p>
                  <p className="text-xs mt-1">
                    New customer inquiries will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            <div className="rounded-3xl bofrder bg-background dark:bg-zinc-900 pb-3">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mt-1">
                    Sales Dashboard
                    <Badge className="ml-3 bg-blue-500 text-xs align-middle">
                      Sales Rep
                    </Badge>
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Manage active leads, schedule appointments, and submit
                    completed consultations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 min-w-[250px]">
                  <div className="rounded-xl bg-primary/5 p-3 text-center">
                    <Inbox className="h-5 w-5 mx-auto text-primary mb-1" />
                    <p className="text-2xl font-bold">{activeLeads.length}</p>
                    <p className="text-xs text-muted-foreground">
                      Active Leads
                    </p>
                  </div>
                  <div className="rounded-xl bg-green-500/5 p-3 text-center">
                    <CalendarCheck className="h-5 w-5 mx-auto text-green-600 mb-1" />
                    <p className="text-2xl font-bold">{bookedCount}</p>
                    <p className="text-xs text-muted-foreground">
                      Appointments
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedLeadForView ? (
              <LeadRow
                lead={selectedLeadForView}
                forSalesRep={true}
                onSubmit={(data) => handleSubmit(selectedLeadForView.id, data)}
              />
            ) : (
              <div className="rounded-3xl border bg-background dark:bg-zinc-900 min-h-[700px] flex flex-col justify-center items-center">
                <UserCheck className="h-20 w-20 text-primary" />
                <h2 className="text-3xl font-bold mt-6">No Lead Selected</h2>
                <p className="text-muted-foreground mt-2">
                  Select a customer from the left to view details and schedule
                  appointments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog />
    </div>
  );
}
