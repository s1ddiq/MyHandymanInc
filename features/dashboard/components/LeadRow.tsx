// features/dashboard/components/LeadRow.tsx
import { Lead } from "@/lib/validators/lead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Mail, Pencil, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LeadRowProps {
  lead: Lead;
  onEdit?: () => void;
  onDelete?: () => void;
  onSubmit?: (data: {
    notes: string;
    appointment?: Date;
    job_details?: string;
  }) => void;
  forSalesRep?: boolean;
}

const LeadRow = ({
  lead,
  forSalesRep,
  onEdit,
  onDelete,
  onSubmit,
}: LeadRowProps) => {
  const [newLeadNotes, setNewLeadNotes] = useState(lead.notes || "");
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [newJobDetails, setNewJobDetails] = useState(lead.job_details || "");

  if (forSalesRep) {
    return (
      <Card className="mb-4">
        <CardContent className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">{lead.name}</h2>

              <p className="text-sm text-muted-foreground">
                Received {formatDistanceToNow(new Date(lead.created_at))} ago
              </p>
            </div>

            {lead.appointment && (
              <Badge className="bg-green-600 text-white">Booked</Badge>
            )}
          </div>

          {/* Contact */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {lead.phone}
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {lead.email}
            </div>
          </div>

          <Separator />

          {/* Job Details */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Job Details</h3>
            <span className="text-xs text-muted-foreground">ID #{lead.id}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Service" value={lead.service} />

            <Info label="Timeframe" value={lead.customer_timeframe} />

            <Info label="Location" value={lead.location} />

            <Info label="Status" value={lead.status} />
          </div>

          {/* Job Details Input */}
          <div className="space-y-2">
            <Label htmlFor="job_details">Job Details</Label>
            <Textarea
              id="job_details"
              value={newJobDetails}
              onChange={(e) => setNewJobDetails(e.target.value)}
              placeholder="Enter detailed job description..."
              rows={4}
            />
          </div>

          {lead.customer_notes && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                Customer Notes
              </p>

              <p className="text-sm leading-relaxed">{lead.customer_notes}</p>
            </div>
          )}

          <Separator />

          {/* Team Notes */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Team Notes
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const timestamp = new Date().toLocaleString();
                  const newNote = newLeadNotes
                    ? `${newLeadNotes}\nNo answer - ${timestamp}`
                    : `No answer - ${timestamp}`;
                  setNewLeadNotes(newNote);
                }}
              >
                No Answer
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const timestamp = new Date().toLocaleString();
                  const newNote = newLeadNotes
                    ? `${newLeadNotes}\nLeft voicemail - ${timestamp}`
                    : `Left voicemail - ${timestamp}`;
                  setNewLeadNotes(newNote);
                }}
              >
                Left Voicemail
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const timestamp = new Date().toLocaleString();
                  const newNote = newLeadNotes
                    ? `${newLeadNotes}\nSent text - ${timestamp}`
                    : `Sent text - ${timestamp}`;
                  setNewLeadNotes(newNote);
                }}
              >
                Sent Text
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const timestamp = new Date().toLocaleString();
                  const newNote = newLeadNotes
                    ? `${newLeadNotes}\nCalled and spoke with customer - ${timestamp}`
                    : `Called and spoke with customer - ${timestamp}`;
                  setNewLeadNotes(newNote);
                }}
              >
                Spoke with Customer
              </Button>
            </div>

            <Textarea
              className="text-lg leading-relaxed"
              value={newLeadNotes}
              onChange={(e) => setNewLeadNotes(e.target.value)}
              placeholder="Add team notes here..."
              rows={6}
            />
          </div>

          {/* Appointment Selector */}
          <div className="space-y-2">
            <Label htmlFor="appointment">Schedule Appointment</Label>
            <Input
              id="appointment"
              type="datetime-local"
              value={selectedAppointment}
              onChange={(e) => setSelectedAppointment(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>

        <CardFooter className="border-t px-5 py-3 gap-4">
          <Button
            size="lg"
            className="w-full ml-auto"
            disabled={!newLeadNotes}
            onClick={() => {
              if (newLeadNotes && onSubmit) {
                onSubmit({
                  notes: newLeadNotes,
                  appointment: selectedAppointment
                    ? new Date(selectedAppointment)
                    : undefined,
                  job_details: newJobDetails,
                });
              }
            }}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Admin view
  return (
    <Card className="mb-4">
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{lead.name}</h2>

            <p className="text-sm text-muted-foreground">
              Received {formatDistanceToNow(new Date(lead.created_at))} ago
            </p>
          </div>

          <Badge variant={lead.appointment ? "default" : "secondary"}>
            {lead.appointment ? "Booked" : "Pending"}
          </Badge>
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {lead.phone}
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {lead.email}
          </div>
        </div>

        <Separator />

        {/* Job Details */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Job Details</h3>
          <span className="text-xs text-muted-foreground">ID #{lead.id}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Info label="Service" value={lead.service} />

          <Info label="Timeframe" value={lead.customer_timeframe} />

          <Info label="Location" value={lead.location} />

          <Info label="Status" value={lead.status} />

          <Info
            label="Appointment"
            value={
              lead.appointment
                ? (() => {
                    const d = new Date(lead.appointment);
                    return (
                      d.toLocaleString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "America/New_York",
                      }) + " EST"
                    );
                  })()
                : "No appointment is booked."
            }
          />
        </div>

        {/* Job Details Display */}
        {lead.job_details && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Job Details
            </p>

            <p className="text-sm leading-relaxed">{lead.job_details}</p>
          </div>
        )}

        {lead.customer_notes && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Customer Notes
            </p>

            <p className="text-sm leading-relaxed">{lead.customer_notes}</p>
          </div>
        )}

        <Separator />

        {/* Team Notes */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
            Team Notes
          </p>

          <p className="text-lg leading-relaxed">
            {lead.notes || "No team notes yet."}
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t px-5 py-3">
        <Button
          size="sm"
          variant="destructive"
          className="ml-2"
          onClick={onDelete}
        >
          Delete
        </Button>

        <Button size="sm" className="ml-auto" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeadRow;

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
