CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"issuer" text NOT NULL,
	"issued_at" text,
	"credential_id" text,
	"credential_url" text,
	"order" integer DEFAULT 0 NOT NULL
);
