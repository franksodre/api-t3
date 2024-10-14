ALTER TABLE "auth_link" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_recipient_unique" UNIQUE("recipient");