CREATE TABLE "product_store_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"store_id" text,
	"other_store_name" text,
	"proof_image_url" text NOT NULL,
	"submitted_by_id" text NOT NULL,
	"status" "product_status" DEFAULT 'pending_review' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewed_by_id" text
);
--> statement-breakpoint
ALTER TABLE "product_store_submissions" ADD CONSTRAINT "product_store_submissions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_store_submissions" ADD CONSTRAINT "product_store_submissions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_store_submissions" ADD CONSTRAINT "product_store_submissions_submitted_by_id_user_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_store_submissions" ADD CONSTRAINT "product_store_submissions_reviewed_by_id_user_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;