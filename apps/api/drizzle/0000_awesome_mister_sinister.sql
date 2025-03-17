CREATE TYPE "public"."block_type" AS ENUM('paragraph', 'heading1', 'heading2', 'heading3', 'bulletList', 'numberedList', 'quote', 'code');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "note_user" (
	"note_id" uuid NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"color" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	"last_edited" timestamp DEFAULT now() NOT NULL,
	"last_edited_by" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "note_user" ADD CONSTRAINT "note_user_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
