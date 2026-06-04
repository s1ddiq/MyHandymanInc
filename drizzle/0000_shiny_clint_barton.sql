CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"description" text NOT NULL,
	"notes" text,
	"appointment" text,
	"job_details" text,
	"location" text,
	"customer_notes" text,
	"service" text NOT NULL,
	"customer_timeframe" text,
	"contact_status" text DEFAULT 'New' NOT NULL,
	"status" text DEFAULT 'New' NOT NULL
);
