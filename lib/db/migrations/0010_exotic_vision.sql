ALTER TABLE "Stream" DROP CONSTRAINT "Stream_id_pk";--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "Stream" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE varchar(255);