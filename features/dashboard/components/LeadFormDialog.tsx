"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Lead,
  CreateLeadInput,
  leadSchema,
  DEFAULT_LEAD_VALUES,
} from "@/lib/validators/lead";
import { FileJson, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

// Helper function to infer form data from JSON
function inferFormDataFromJson(jsonData: any): Partial<CreateLeadInput> {
  const inferredData: Partial<CreateLeadInput> = {};

  // Map customer name
  if (jsonData.customer?.fullName) {
    inferredData.name = jsonData.customer.fullName;
  } else if (jsonData.messaging?.customerName) {
    inferredData.name = jsonData.messaging.customerName;
  } else if (jsonData.name) {
    inferredData.name = jsonData.name;
  } else if (jsonData.customerName) {
    inferredData.name = jsonData.customerName;
  }

  // Map email
  if (jsonData.contact?.email) {
    inferredData.email = jsonData.contact.email;
  } else if (jsonData.email) {
    inferredData.email = jsonData.email;
  } else if (jsonData.customer?.email) {
    inferredData.email = jsonData.customer.email;
  }

  // Map phone
  if (jsonData.contact?.phone) {
    inferredData.phone = jsonData.contact.phone;
  } else if (jsonData.phone) {
    inferredData.phone = jsonData.phone;
  } else if (jsonData.customer?.phone) {
    inferredData.phone = jsonData.customer.phone;
  }

  // Map service
  if (jsonData.jobDetails?.service) {
    inferredData.service = jsonData.jobDetails.service;
  } else if (jsonData.service) {
    inferredData.service = jsonData.service;
  } else if (jsonData.job?.service) {
    inferredData.service = jsonData.job.service;
  }

  // Map location
  if (jsonData.jobDetails?.location) {
    inferredData.location = jsonData.jobDetails.location;
  } else if (jsonData.location) {
    inferredData.location = jsonData.location;
  } else if (jsonData.job?.location) {
    inferredData.location = jsonData.job.location;
  }

  // Map status
  const statusValue =
    jsonData.customer?.contactStatus ||
    jsonData.customer?.jobStatus ||
    jsonData.status ||
    jsonData.jobStatus ||
    jsonData.contactStatus;

  if (
    statusValue &&
    [
      "Potential",
      "Contacted",
      "Qualified",
      "Proposal",
      "Negotiation",
      "Won",
      "Lost",
      "Submitted",
      "active",
    ].includes(statusValue)
  ) {
    inferredData.status = statusValue;
  }

  // Map customer timeframe
  if (jsonData.jobDetails?.customerTimeframe) {
    inferredData.customer_timeframe = jsonData.jobDetails.customerTimeframe;
  } else if (jsonData.customerTimeframe) {
    inferredData.customer_timeframe = jsonData.customerTimeframe;
  } else if (jsonData.timeframe) {
    inferredData.customer_timeframe = jsonData.timeframe;
  }

  // Map job details
  if (jsonData.jobDetails?.description) {
    inferredData.job_details = jsonData.jobDetails.description;
  } else if (jsonData.jobDetails?.customerNotes) {
    inferredData.job_details = jsonData.jobDetails.customerNotes;
  } else if (jsonData.description) {
    inferredData.job_details = jsonData.description;
  } else if (jsonData.jobDetails?.service) {
    inferredData.job_details = `${jsonData.jobDetails.service} - ${jsonData.jobDetails.location || "Location TBD"}`;
  }

  // Map description
  if (jsonData.jobDetails?.customerNotes) {
    inferredData.description = jsonData.jobDetails.customerNotes;
  } else if (jsonData.description) {
    inferredData.description = jsonData.description;
  } else if (jsonData.jobDetails?.description) {
    inferredData.description = jsonData.jobDetails.description;
  } else if (jsonData.jobDetails?.service) {
    inferredData.description = `${jsonData.jobDetails.service} - ${jsonData.jobDetails.location || "Location TBD"}`;
  }

  // Map customer notes
  if (jsonData.jobDetails?.customerNotes) {
    inferredData.customer_notes = jsonData.jobDetails.customerNotes;
  } else if (jsonData.customerNotes) {
    inferredData.customer_notes = jsonData.customerNotes;
  } else if (jsonData.customer?.notes) {
    inferredData.customer_notes = jsonData.customer.notes;
  }

  // Map appointment
  const appointmentValue =
    jsonData.appointment?.date ||
    jsonData.appointment?.datetime ||
    jsonData.appointment?.scheduledDate ||
    jsonData.appointmentDate ||
    jsonData.scheduledDate;

  if (appointmentValue) {
    const appointmentDate = new Date(appointmentValue);

    if (!isNaN(appointmentDate.getTime())) {
      inferredData.appointment = appointmentDate.toISOString();
    }
  }

  return inferredData;
}

export function LeadFormDialog({
  open,
  onOpenChange,
  lead,
}: LeadFormDialogProps) {
  const isEditing = !!lead;
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [jsonText, setJsonText] = useState("");
  const [isAutoCreating, setIsAutoCreating] = useState(false);
  const isProcessingRef = useRef(false);

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(leadSchema),
    values: lead || DEFAULT_LEAD_VALUES,
  });

  const createMutation = useMutation(
    trpc.leads.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.leads.getPublic.queryKey(),
        });
        onOpenChange(false);
        form.reset();
        toast.success("Lead created successfully");
        router.refresh();
        setIsAutoCreating(false);
      },
      onError: (error: any) => {
        setIsAutoCreating(false);
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

  const updateMutation = useMutation(
    trpc.leads.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.leads.getPublic.queryKey(),
        });
        onOpenChange(false);
        toast.success("Lead updated successfully");
        router.refresh();
        setIsAutoCreating(false);
      },
      onError: (error: any) => {
        setIsAutoCreating(false);
        if (error.data?.code === "FORBIDDEN") {
          toast.error("You don't have permission to update leads");
          return;
        }
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Please sign in to update leads");
          router.push("/sign-in");
          return;
        }
        toast.error(error?.message ?? "Failed to update lead");
      },
    }),
  );

  // Auto-create lead when JSON is pasted in the textarea
  const handleJsonPaste = async (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text");
    setJsonText(pastedText);

    if (isProcessingRef.current || isEditing) return;

    isProcessingRef.current = true;
    setIsAutoCreating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 50));

      const jsonData = JSON.parse(pastedText);
      const inferredData = inferFormDataFromJson(jsonData);

      // Check if we have enough data to auto-create
      if (inferredData.name && inferredData.service) {
        Object.entries(inferredData).forEach(([key, value]) => {
          if (value !== undefined) {
            form.setValue(key as keyof CreateLeadInput, value);
          }
        });

        toast.success("Lead data detected! Auto-creating...");

        setTimeout(() => {
          form.handleSubmit(async (data) => {
            await createMutation.mutateAsync(data);
          })();
        }, 300);
      } else {
        toast.error(
          "Not enough lead data found in JSON. Need name and service.",
        );
        setIsAutoCreating(false);
      }

      setJsonText("");
    } catch (error) {
      console.error("Error processing pasted JSON:", error);
      toast.error("Invalid JSON format. Please check and try again.");
      setIsAutoCreating(false);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Manual submit handler
  const onSubmit = form.handleSubmit(async (data) => {
    if (isEditing && lead) {
      await updateMutation.mutateAsync({
        id: lead.id,
        data: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl! w-full! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Lead" : "Create New Lead"}
          </DialogTitle>
        </DialogHeader>

        {/* JSON Paste Area - Always visible for new leads */}
        {!isEditing && (
          <div className="rounded-lg bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-semibold">
                Paste JSON Data (auto-creates lead)
              </Label>
              {isAutoCreating && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </div>
              )}
            </div>
            <Textarea
              value={jsonText}
              onPaste={handleJsonPaste}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste your JSON here. If it contains lead data (name and service), it will auto-create."
              rows={6}
              className="font-mono text-sm"
              disabled={isAutoCreating}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Tip: Paste JSON with at least a name and service to auto-create a
              lead.
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="John Doe"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="john@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="(555) 123-4567"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Input
                  id="service"
                  {...form.register("service")}
                  placeholder="Plumbing, Electrical, etc."
                />
                {form.formState.errors.service && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.service.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...form.register("location")}
                  placeholder="City, State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment">Appointment</Label>
                <Input
                  id="appointment"
                  type="datetime-local"
                  {...form.register("appointment")}
                />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status & Tracking</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => form.setValue("status", value)}
                  defaultValue={form.watch("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="potential">Potential</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal Sent</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_timeframe">Customer Timeframe</Label>
                <Input
                  id="customer_timeframe"
                  {...form.register("customer_timeframe")}
                  placeholder="Immediate, 1-2 weeks, 1 month, etc."
                />
              </div>
            </div>
          </div>

          {/* Description & Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description & Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Detailed description of the job or service needed..."
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_details">Job Details</Label>
                <Textarea
                  id="job_details"
                  {...form.register("job_details")}
                  placeholder="Specific job requirements, measurements, materials needed..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Internal notes for team members..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_notes">Customer Notes</Label>
                <Textarea
                  id="customer_notes"
                  {...form.register("customer_notes")}
                  placeholder="Special requests, preferences, or notes from the customer..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isAutoCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isAutoCreating}>
              {isPending || isAutoCreating
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
