CREATE TABLE "off_ingredient_mappings" (
	"off_tag" text PRIMARY KEY NOT NULL,
	"ingredient_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unmapped_off_ingredients" (
	"tag" text PRIMARY KEY NOT NULL,
	"occurrences" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ingredients" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "off_ingredients" jsonb;--> statement-breakpoint
ALTER TABLE "off_ingredient_mappings" ADD CONSTRAINT "off_ingredient_mappings_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;