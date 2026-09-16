CREATE TABLE "user_excluded_ingredients" (
	"user_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	CONSTRAINT "user_excluded_ingredients_user_id_ingredient_id_pk" PRIMARY KEY("user_id","ingredient_id")
);
--> statement-breakpoint
ALTER TABLE "user_excluded_ingredients" ADD CONSTRAINT "user_excluded_ingredients_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_excluded_ingredients" ADD CONSTRAINT "user_excluded_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;