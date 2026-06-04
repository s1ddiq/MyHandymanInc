ALTER TABLE "leads" ALTER COLUMN "contact_status" SET DEFAULT 'Selected Show Number';--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "status" SET DEFAULT 'Potential';--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;