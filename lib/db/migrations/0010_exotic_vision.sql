-- Drop foreign key constraints first
ALTER TABLE "Chat" DROP CONSTRAINT IF EXISTS "Chat_userId_User_id_fk";--> statement-breakpoint
ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_userId_User_id_fk";--> statement-breakpoint
ALTER TABLE "Suggestion" DROP CONSTRAINT IF EXISTS "Suggestion_userId_User_id_fk";--> statement-breakpoint

-- Alter columns to varchar(255)
ALTER TABLE "Chat" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE varchar(255);--> statement-breakpoint

-- Handle Stream PK changes from original migration
ALTER TABLE "Stream" DROP CONSTRAINT IF EXISTS "Stream_id_pk";--> statement-breakpoint
ALTER TABLE "Stream" ADD PRIMARY KEY ("id");--> statement-breakpoint

-- Re-add foreign key constraints
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;