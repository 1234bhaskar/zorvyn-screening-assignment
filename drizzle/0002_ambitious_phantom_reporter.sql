CREATE TYPE "public"."record_category" AS ENUM('salary', 'rent', 'food', 'utilities', 'healthcare', 'transportation', 'entertainment', 'bills', 'investment', 'other');--> statement-breakpoint
CREATE TYPE "public"."record_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"type" "record_type" NOT NULL,
	"category" "record_category" NOT NULL,
	"date" timestamp NOT NULL,
	"notes" text,
	"user_id" integer NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
