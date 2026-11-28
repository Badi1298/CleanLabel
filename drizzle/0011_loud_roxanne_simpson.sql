CREATE TYPE "public"."app_install_platform" AS ENUM('ios', 'android', 'desktop');--> statement-breakpoint
CREATE TABLE "user_app_installs" (
	"user_id" text PRIMARY KEY NOT NULL,
	"platform" "app_install_platform" NOT NULL,
	"first_installed_at" timestamp DEFAULT now() NOT NULL,
	"last_standalone_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_daily_activity" (
	"user_id" text NOT NULL,
	"activity_date" date NOT NULL,
	"used_standalone" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_daily_activity_user_id_activity_date_pk" PRIMARY KEY("user_id","activity_date")
);
--> statement-breakpoint
ALTER TABLE "user_app_installs" ADD CONSTRAINT "user_app_installs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_daily_activity" ADD CONSTRAINT "user_daily_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_app_installs_first_installed_at_idx" ON "user_app_installs" USING btree ("first_installed_at");--> statement-breakpoint
CREATE INDEX "user_daily_activity_date_idx" ON "user_daily_activity" USING btree ("activity_date");