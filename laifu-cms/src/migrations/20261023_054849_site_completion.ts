import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_pages_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum_consultation_requests_status" AS ENUM('new', 'contacted', 'scheduled', 'closed');
  CREATE TABLE "site_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar,
  	"route" varchar,
  	"anchor_prefix" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"original_image" jsonb,
  	"content" jsonb,
  	"booking_phone" varchar,
  	"booking_wechat" varchar,
  	"booking_questionnaire" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar,
  	"version_route" varchar,
  	"version_anchor_prefix" varchar,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_original_image" jsonb,
  	"version_content" jsonb,
  	"version_booking_phone" varchar,
  	"version_booking_wechat" varchar,
  	"version_booking_questionnaire" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "consultation_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"wechat" varchar,
  	"consultation_type" varchar NOT NULL,
  	"concern" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_consultation_requests_status" DEFAULT 'new' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultation_requests_id" integer;
  ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_parent_id_site_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "site_pages_route_idx" ON "site_pages" USING btree ("route");
  CREATE INDEX "site_pages_image_idx" ON "site_pages" USING btree ("image_id");
  CREATE INDEX "site_pages_updated_at_idx" ON "site_pages" USING btree ("updated_at");
  CREATE INDEX "site_pages_created_at_idx" ON "site_pages" USING btree ("created_at");
  CREATE INDEX "site_pages__status_idx" ON "site_pages" USING btree ("_status");
  CREATE INDEX "_site_pages_v_parent_idx" ON "_site_pages_v" USING btree ("parent_id");
  CREATE INDEX "_site_pages_v_version_version_route_idx" ON "_site_pages_v" USING btree ("version_route");
  CREATE INDEX "_site_pages_v_version_version_image_idx" ON "_site_pages_v" USING btree ("version_image_id");
  CREATE INDEX "_site_pages_v_version_version_updated_at_idx" ON "_site_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_pages_v_version_version_created_at_idx" ON "_site_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_site_pages_v_version_version__status_idx" ON "_site_pages_v" USING btree ("version__status");
  CREATE INDEX "_site_pages_v_created_at_idx" ON "_site_pages_v" USING btree ("created_at");
  CREATE INDEX "_site_pages_v_updated_at_idx" ON "_site_pages_v" USING btree ("updated_at");
  CREATE INDEX "_site_pages_v_snapshot_idx" ON "_site_pages_v" USING btree ("snapshot");
  CREATE INDEX "_site_pages_v_published_locale_idx" ON "_site_pages_v" USING btree ("published_locale");
  CREATE INDEX "_site_pages_v_latest_idx" ON "_site_pages_v" USING btree ("latest");
  CREATE INDEX "_site_pages_v_autosave_idx" ON "_site_pages_v" USING btree ("autosave");
  CREATE INDEX "consultation_requests_phone_idx" ON "consultation_requests" USING btree ("phone");
  CREATE INDEX "consultation_requests_updated_at_idx" ON "consultation_requests" USING btree ("updated_at");
  CREATE INDEX "consultation_requests_created_at_idx" ON "consultation_requests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_pages_fk" FOREIGN KEY ("site_pages_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultation_requests_fk" FOREIGN KEY ("consultation_requests_id") REFERENCES "public"."consultation_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_site_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("site_pages_id");
  CREATE INDEX "payload_locked_documents_rels_consultation_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("consultation_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_pages" CASCADE;
  DROP TABLE "_site_pages_v" CASCADE;
  DROP TABLE "consultation_requests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_site_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultation_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_site_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_consultation_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultation_requests_id";
  DROP TYPE "public"."enum_site_pages_status";
  DROP TYPE "public"."enum__site_pages_v_version_status";
  DROP TYPE "public"."enum__site_pages_v_published_locale";
  DROP TYPE "public"."enum_consultation_requests_status";`)
}
