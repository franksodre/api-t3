CREATE TABLE "invite_link" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invite_link_code_unique" UNIQUE("code")
);
