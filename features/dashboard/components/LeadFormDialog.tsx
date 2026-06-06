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

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
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

  // ✅ FIXED: Remove explicit type annotation
  const onSubmit = form.handleSubmit(async (data) => {
    if (isEditing) {
      // ✅ Pass as { id, data }
      await updateMutation.mutateAsync({
        id: lead.id,
        data: data, // 👈 Wrap in 'data' property
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
