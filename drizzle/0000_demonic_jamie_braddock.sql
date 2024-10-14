CREATE TYPE "public"."roles_enum" AS ENUM('customer', 'manager', 'owner');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'REVIEWING', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."StateInvitation_enum" AS ENUM('accepted', 'refused', 'received', 'no actions');--> statement-breakpoint
CREATE TYPE "public"."PricingPlans_enum" AS ENUM('basic', 'standard', 'premium', 'custom');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"manager_id" text,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"role" "roles_enum" DEFAULT 'customer' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_link" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "auth_link_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(28) NOT NULL,
	"service_id" text,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"service_id" text NOT NULL,
	"status" "order_status" DEFAULT 'PENDING',
	"finished_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"id" text PRIMARY KEY NOT NULL,
	"recipient" text NOT NULL,
	"by" text,
	"message" varchar(300) NOT NULL,
	"state" "StateInvitation_enum" DEFAULT 'no actions' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "owner" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"role" "roles_enum" DEFAULT 'owner' NOT NULL,
	CONSTRAINT "owner_email_unique" UNIQUE("email"),
	CONSTRAINT "owner_role_unique" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pricing_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" "PricingPlans_enum" DEFAULT 'basic' NOT NULL,
	"details" varchar(100) NOT NULL,
	"package" varchar(100)[] DEFAULT ARRAY[]::varchar[] NOT NULL,
	"promises" text[4] DEFAULT '{}'::text[],
	"service_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_link" ADD CONSTRAINT "auth_link_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_by_owner_id_fk" FOREIGN KEY ("by") REFERENCES "public"."owner"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pricing_plans" ADD CONSTRAINT "pricing_plans_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
