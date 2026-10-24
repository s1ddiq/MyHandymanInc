CREATE TABLE "signing_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(64) NOT NULL,
	"lead_id" serial NOT NULL,
	"pdf_path" text NOT NULL,
	"pdf_file_name" text,
	"signer_name" text,
	"signer_email" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"signature_data" text,
	"signed_ip" text,
	"signed_user_agent" text,
	"source_domain" text,
	"expires_at" timestamp NOT NULL,
	"signed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "signing_requests_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "signing_requests" ADD CONSTRAINT "signing_requests_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;