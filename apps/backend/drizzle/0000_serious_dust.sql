DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('fetchingTranscript', 'fetchingGptResponse', 'generatingFinalStructure', 'ok', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindmaps" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"transcript" json,
	"gpt_response" json,
	"structure" json,
	"status" "status"
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "mindmaps" ("video_id");