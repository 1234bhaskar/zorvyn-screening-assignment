ALTER TABLE "user_roles_table" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_roles_table" CASCADE;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "role_id" integer;--> statement-breakpoint
ALTER TABLE "users_table" ADD CONSTRAINT "users_table_role_id_roles_table_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles_table"("id") ON DELETE no action ON UPDATE no action;