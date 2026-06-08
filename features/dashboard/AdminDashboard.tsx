// features/dashboard/AdminDashboard.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Smile } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const trpc = useTRPC();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [activeTab, setActiveTab] = useState("active");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedLeadForView, setSelectedLeadForView] = useState<Lead | null>(
    null,
  );

  const { confirm, ConfirmationDialog } = useConfirmation();

  const {
    data: allLeads,
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

  const activeLeads =
    allLeads?.filter((lead) => lead.status !== "Submitted") || [];
  const submittedLeads =
    allLeads?.filter((lead) => lead.status === "Submitted") || [];

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

  const handleLeadClick = (lead: Lead) => {
    setSelectedLeadForView(lead);
  };

  return (
    <div className="flex h-screen bg-muted/30 w-full">
      <div className="mx-auto max-w-7xl w-full flex">
        {/* Collapsible Sidebar */}
        <div
          className={cn(
            "bg-background border-x transition-all duration-300 flex flex-col border-rf",
            !isSidebarCollapsed ? "w-[300px]" : "w-[80px]",
          )}
        >
          <div className="p-4 border-b flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="font-semibold text-lg">Leads</h2>
            )}
            <Button size="sm" onClick={handleCreateClick}>
              + Create
            </Button>
          </div>

          {!isSidebarCollapsed ? (
            <Tabs
              defaultValue="active"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="active"
                    className="flex items-center gap-2"
                  >
                    Active{" "}
                    <Badge variant="secondary">{activeLeads.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="submitted"
                    className="flex items-center gap-2"
                  >
                    Submitted{" "}
                    <Badge variant="secondary">{submittedLeads.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="active"
                className="flex-1 overflow-y-auto px-2 mt-2"
              >
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
              </TabsContent>

              <TabsContent
                value="submitted"
                className="flex-1 overflow-y-auto px-2 mt-2"
              >
                {submittedLeads.map((lead) => (
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
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 overflow-y-auto py-4">
              {(activeTab === "active" ? activeLeads : submittedLeads).map(
                (lead) => (
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
                ),
              )}
            </div>
          )}
        </div>

        {/* Main Content - Lead Viewer with max-w-7xl */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {selectedLeadForView ? (
              <LeadRow
                lead={selectedLeadForView}
                onEdit={() => handleEditClick(selectedLeadForView)}
                onDelete={() => handleDelete(selectedLeadForView)}
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

        <LeadFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          lead={selectedLead}
        />
        <ConfirmationDialog />
      </div>
    </div>
  );
}
