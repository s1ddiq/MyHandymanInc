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
import { FileJson, X } from "lucide-react";
import { useState, useRef } from "react";

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
  }

  // Map email
  if (jsonData.contact?.email) {
    inferredData.email = jsonData.contact.email;
  }

  // Map phone
  if (jsonData.contact?.phone) {
    inferredData.phone = jsonData.contact.phone;
  }

  // Map service
  if (jsonData.jobDetails?.service) {
    inferredData.service = jsonData.jobDetails.service;
  }

  // Map location
  if (jsonData.jobDetails?.location) {
    inferredData.location = jsonData.jobDetails.location;
  }

  // Map status from customer contactStatus or jobStatus
  if (
    jsonData.customer?.contactStatus &&
    [
      "Potential",
      "Contacted",
      "Qualified",
      "Proposal",
      "Negotiation",
      "Won",
      "Lost",
    ].includes(jsonData.customer.contactStatus)
  ) {
    inferredData.status = jsonData.customer.contactStatus;
  } else if (
    jsonData.customer?.jobStatus &&
    [
      "Potential",
      "Contacted",
      "Qualified",
      "Proposal",
      "Negotiation",
      "Won",
      "Lost",
    ].includes(jsonData.customer.jobStatus)
  ) {
    inferredData.status = jsonData.customer.jobStatus;
  }

  // Map customer timeframe
  if (jsonData.jobDetails?.customerTimeframe) {
    inferredData.customer_timeframe = jsonData.jobDetails.customerTimeframe;
  }

  // Map description from job details
  if (jsonData.jobDetails?.customerNotes) {
    inferredData.description = jsonData.jobDetails.customerNotes;
  } else if (jsonData.jobDetails?.service) {
    inferredData.description = `${jsonData.jobDetails.service} - ${jsonData.jobDetails.location || "Location TBD"}`;
  }

  // Map customer notes
  if (jsonData.jobDetails?.customerNotes) {
    inferredData.customer_notes = jsonData.jobDetails.customerNotes;
  }

  // Map appointment if exists with EST timezone handling
  if (jsonData.appointment?.date || jsonData.appointment?.time) {
    // Try to construct appointment date from various formats
    let appointmentDate = null;

    if (jsonData.appointment.date) {
      appointmentDate = new Date(jsonData.appointment.date);
    } else if (jsonData.appointment.datetime) {
      appointmentDate = new Date(jsonData.appointment.datetime);
    } else if (jsonData.appointment.scheduledDate) {
      appointmentDate = new Date(jsonData.appointment.scheduledDate);
    }

    // If we have a valid date, use it
    if (appointmentDate && !isNaN(appointmentDate.getTime())) {
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
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonText, setJsonText] = useState("");
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

  const updateMutation = useMutation(
    trpc.leads.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.leads.getPublic.queryKey(),
        });
        onOpenChange(false);
        toast.success("Lead updated successfully");
        router.refresh();
      },
      onError: (error: any) => {
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

  const handlePasteJson = () => {
    if (!jsonText.trim()) {
      toast.error("Please paste some JSON data");
      return false;
    }

    try {
      const jsonData = JSON.parse(jsonText);
      const inferredData = inferFormDataFromJson(jsonData);

      // Update form fields with inferred data
      Object.entries(inferredData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof CreateLeadInput, value);
        }
      });

      toast.success("Form fields populated from pasted JSON!");
      setShowJsonInput(false);
      setJsonText("");
      return true;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      toast.error("Invalid JSON format. Please check and try again.");
      return false;
    }
  };

  // Auto-create lead when JSON is pasted
  const handleJsonPaste = async (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const pastedText = e.clipboardData.getData("text");
    setJsonText(pastedText);

    // Don't auto-submit if we're already processing
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      // Small delay to ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 50));

      const jsonData = JSON.parse(pastedText);
      const inferredData = inferFormDataFromJson(jsonData);

      // Update form fields
      Object.entries(inferredData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof CreateLeadInput, value);
        }
      });

      toast.success("Form populated from pasted JSON!");

      // Auto-submit the form after populating
      setTimeout(() => {
        form.handleSubmit(async (data) => {
          if (isEditing) {
            await updateMutation.mutateAsync({
              id: lead.id,
              data: data,
            });
          } else {
            await createMutation.mutateAsync(data);
          }
        })();
      }, 100);

      setShowJsonInput(false);
      setJsonText("");
    } catch (error) {
      console.error("Error processing pasted JSON:", error);
      toast.error("Invalid JSON format. Please check and try again.");
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Manual submit handler
  const onSubmit = form.handleSubmit(async (data) => {
    if (isEditing) {
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
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Lead" : "Create New Lead"}
          </DialogTitle>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowJsonInput(!showJsonInput)}
            className="gap-2"
          >
            <FileJson className="h-4 w-4" />
            {showJsonInput ? "Cancel" : "Paste JSON"}
          </Button>
        </DialogHeader>

        <div className="mb-6 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-semibold">
              Paste JSON Data (auto-creates lead)
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowJsonInput(false);
                setJsonText("");
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={jsonText}
            onPaste={handleJsonPaste}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Paste your JSON here."
            rows={8}
            className="font-mono text-sm"
          />
          {/* <div className="flex justify-end mt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowJsonInput(false);
                setJsonText("");
              }}
            >
              Cancel
            </Button> */}
          {/* <Button type="button" onClick={handlePasteJson}>
              Parse & Fill Form (Manual)
            </Button> */}
        </div>

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
                    <SelectItem value="Potential">Potential</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Proposal">Proposal Sent</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Won">Won</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEditing ? "Save Changes" : "Create Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
