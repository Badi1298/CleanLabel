CREATE TABLE "off_category_mappings" (
	"off_tag" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unmapped_off_tags" (
	"tag" text PRIMARY KEY NOT NULL,
	"occurrences" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "off_tags" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_reviewed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "off_category_mappings" ADD CONSTRAINT "off_category_mappings_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;