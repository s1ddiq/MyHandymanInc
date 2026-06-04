// features/dashboard/components/LeadRow.tsx
import { Lead } from "@/lib/validators/lead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Pencil, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { formatDistanceToNow } from "date-fns";

interface LeadRowProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
}

const LeadRow = ({ lead, onEdit, onDelete }: LeadRowProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{lead.name}</h2>

            <p className="text-sm text-muted-foreground">
              Received {formatDistanceToNow(lead.created_at)} ago
            </p>
          </div>

          <div className="flex gap-2">
            <Badge>{lead.status}</Badge>
            <Badge variant="secondary">{lead.contact_status}</Badge>
          </div>
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

        {lead.customer_notes && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Notes
            </p>

            <p className="text-sm leading-relaxed">{lead.customer_notes}</p>
          </div>
        )}
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
