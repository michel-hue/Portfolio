CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"kind" text DEFAULT 'work' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"topic" text NOT NULL,
	"body" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"short_name" text NOT NULL,
	"role" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"timezone" text,
	"hero_title" text NOT NULL,
	"hero_intro" text NOT NULL,
	"about_title" text NOT NULL,
	"about_short" text NOT NULL,
	"about_long" text NOT NULL,
	"email" text NOT NULL,
	"github_url" text,
	"linkedin_url" text,
	"portrait_url" text,
	"resume_url" text,
	"available" boolean DEFAULT true NOT NULL,
	"available_from" text,
	"response_time" text DEFAULT '48 h' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"context" text,
	"summary" text NOT NULL,
	"intro" text,
	"cover_url" text,
	"gallery" text[] DEFAULT '{}' NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"role" text,
	"year" integer,
	"duration" text,
	"context_title" text,
	"context_body" text,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"result" text,
	"app_url" text,
	"docs_url" text,
	"source_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "skill_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"name" text NOT NULL,
	"show_in_stack" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_group_id_skill_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."skill_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "messages_ip_created_idx" ON "messages" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "projects_published_order_idx" ON "projects" USING btree ("published","order");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_single_featured_idx" ON "projects" USING btree ("featured") WHERE "projects"."featured";--> statement-breakpoint
CREATE INDEX "skills_group_idx" ON "skills" USING btree ("group_id");