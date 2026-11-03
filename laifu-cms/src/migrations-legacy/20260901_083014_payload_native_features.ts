import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum__home_presentations_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum__page_presentations_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum__navigation_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_log_parent_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('home-presentations', 'page-presentations', 'navigation', 'media');
  CREATE TYPE "public"."enum_payload_query_presets_access_read_constraint" AS ENUM('everyone', 'onlyMe', 'specificUsers');
  CREATE TYPE "public"."enum_payload_query_presets_access_update_constraint" AS ENUM('everyone', 'onlyMe', 'specificUsers');
  CREATE TYPE "public"."enum_payload_query_presets_access_delete_constraint" AS ENUM('everyone', 'onlyMe', 'specificUsers');
  CREATE TYPE "public"."enum_payload_query_presets_related_collection" AS ENUM('home-presentations', 'page-presentations', 'navigation', 'media', 'users', 'avatars', 'publish-events', 'audit-logs');
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb,
  	"parent_task_slug" "enum_payload_jobs_log_parent_task_slug",
  	"parent_task_i_d" varchar
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"concurrency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_query_presets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"is_shared" boolean DEFAULT false,
  	"access_read_constraint" "enum_payload_query_presets_access_read_constraint" DEFAULT 'onlyMe',
  	"access_update_constraint" "enum_payload_query_presets_access_update_constraint" DEFAULT 'onlyMe',
  	"access_delete_constraint" "enum_payload_query_presets_access_delete_constraint" DEFAULT 'onlyMe',
  	"where" jsonb,
  	"columns" jsonb,
  	"group_by" varchar,
  	"related_collection" "enum_payload_query_presets_related_collection" NOT NULL,
  	"is_temp" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_query_presets_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  ALTER TABLE "home_presentations" ADD COLUMN "_order" varchar;
  ALTER TABLE "home_presentations" ADD COLUMN "folder_id" integer;
  ALTER TABLE "home_presentations" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_home_presentations_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "_home_presentations_v" ADD COLUMN "version_folder_id" integer;
  ALTER TABLE "_home_presentations_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_home_presentations_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_home_presentations_v" ADD COLUMN "published_locale" "enum__home_presentations_v_published_locale";
  ALTER TABLE "page_presentations" ADD COLUMN "_order" varchar;
  ALTER TABLE "page_presentations" ADD COLUMN "folder_id" integer;
  ALTER TABLE "page_presentations" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_page_presentations_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "_page_presentations_v" ADD COLUMN "version_folder_id" integer;
  ALTER TABLE "_page_presentations_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_page_presentations_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_page_presentations_v" ADD COLUMN "published_locale" "enum__page_presentations_v_published_locale";
  ALTER TABLE "navigation" ADD COLUMN "_order" varchar;
  ALTER TABLE "navigation" ADD COLUMN "folder_id" integer;
  ALTER TABLE "navigation" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_navigation_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "_navigation_v" ADD COLUMN "version_folder_id" integer;
  ALTER TABLE "_navigation_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_navigation_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_navigation_v" ADD COLUMN "published_locale" "enum__navigation_v_published_locale";
  ALTER TABLE "media" ADD COLUMN "_order" varchar;
  ALTER TABLE "media" ADD COLUMN "folder_id" integer;
  ALTER TABLE "media" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_media_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "_media_v" ADD COLUMN "version_folder_id" integer;
  ALTER TABLE "_media_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "users" ADD COLUMN "username" varchar;
  ALTER TABLE "avatars" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_folders_id" integer;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_query_presets_rels" ADD CONSTRAINT "payload_query_presets_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_query_presets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_query_presets_rels" ADD CONSTRAINT "payload_query_presets_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_query_presets_updated_at_idx" ON "payload_query_presets" USING btree ("updated_at");
  CREATE INDEX "payload_query_presets_created_at_idx" ON "payload_query_presets" USING btree ("created_at");
  CREATE INDEX "payload_query_presets_rels_order_idx" ON "payload_query_presets_rels" USING btree ("order");
  CREATE INDEX "payload_query_presets_rels_parent_idx" ON "payload_query_presets_rels" USING btree ("parent_id");
  CREATE INDEX "payload_query_presets_rels_path_idx" ON "payload_query_presets_rels" USING btree ("path");
  CREATE INDEX "payload_query_presets_rels_users_id_idx" ON "payload_query_presets_rels" USING btree ("users_id");
  ALTER TABLE "home_presentations" ADD CONSTRAINT "home_presentations_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_presentations_v" ADD CONSTRAINT "_home_presentations_v_version_folder_id_payload_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_presentations" ADD CONSTRAINT "page_presentations_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_presentations_v" ADD CONSTRAINT "_page_presentations_v_version_folder_id_payload_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v" ADD CONSTRAINT "_navigation_v_version_folder_id_payload_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version_folder_id_payload_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_presentations__order_idx" ON "home_presentations" USING btree ("_order");
  CREATE INDEX "home_presentations_folder_idx" ON "home_presentations" USING btree ("folder_id");
  CREATE INDEX "home_presentations_deleted_at_idx" ON "home_presentations" USING btree ("deleted_at");
  CREATE INDEX "_home_presentations_v_version_version__order_idx" ON "_home_presentations_v" USING btree ("version__order");
  CREATE INDEX "_home_presentations_v_version_version_folder_idx" ON "_home_presentations_v" USING btree ("version_folder_id");
  CREATE INDEX "_home_presentations_v_version_version_deleted_at_idx" ON "_home_presentations_v" USING btree ("version_deleted_at");
  CREATE INDEX "_home_presentations_v_snapshot_idx" ON "_home_presentations_v" USING btree ("snapshot");
  CREATE INDEX "_home_presentations_v_published_locale_idx" ON "_home_presentations_v" USING btree ("published_locale");
  CREATE INDEX "page_presentations__order_idx" ON "page_presentations" USING btree ("_order");
  CREATE INDEX "page_presentations_folder_idx" ON "page_presentations" USING btree ("folder_id");
  CREATE INDEX "page_presentations_deleted_at_idx" ON "page_presentations" USING btree ("deleted_at");
  CREATE INDEX "_page_presentations_v_version_version__order_idx" ON "_page_presentations_v" USING btree ("version__order");
  CREATE INDEX "_page_presentations_v_version_version_folder_idx" ON "_page_presentations_v" USING btree ("version_folder_id");
  CREATE INDEX "_page_presentations_v_version_version_deleted_at_idx" ON "_page_presentations_v" USING btree ("version_deleted_at");
  CREATE INDEX "_page_presentations_v_snapshot_idx" ON "_page_presentations_v" USING btree ("snapshot");
  CREATE INDEX "_page_presentations_v_published_locale_idx" ON "_page_presentations_v" USING btree ("published_locale");
  CREATE INDEX "navigation__order_idx" ON "navigation" USING btree ("_order");
  CREATE INDEX "navigation_folder_idx" ON "navigation" USING btree ("folder_id");
  CREATE INDEX "navigation_deleted_at_idx" ON "navigation" USING btree ("deleted_at");
  CREATE INDEX "_navigation_v_version_version__order_idx" ON "_navigation_v" USING btree ("version__order");
  CREATE INDEX "_navigation_v_version_version_folder_idx" ON "_navigation_v" USING btree ("version_folder_id");
  CREATE INDEX "_navigation_v_version_version_deleted_at_idx" ON "_navigation_v" USING btree ("version_deleted_at");
  CREATE INDEX "_navigation_v_snapshot_idx" ON "_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_navigation_v_published_locale_idx" ON "_navigation_v" USING btree ("published_locale");
  CREATE INDEX "media__order_idx" ON "media" USING btree ("_order");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE INDEX "_media_v_version_version__order_idx" ON "_media_v" USING btree ("version__order");
  CREATE INDEX "_media_v_version_version_folder_idx" ON "_media_v" USING btree ("version_folder_id");
  CREATE INDEX "_media_v_version_version_deleted_at_idx" ON "_media_v" USING btree ("version_deleted_at");
  CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "avatars_deleted_at_idx" ON "avatars" USING btree ("deleted_at");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders_folder_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_query_presets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_query_presets_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_query_presets" CASCADE;
  DROP TABLE "payload_query_presets_rels" CASCADE;
  ALTER TABLE "home_presentations" DROP CONSTRAINT "home_presentations_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "_home_presentations_v" DROP CONSTRAINT "_home_presentations_v_version_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "page_presentations" DROP CONSTRAINT "page_presentations_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "_page_presentations_v" DROP CONSTRAINT "_page_presentations_v_version_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "navigation" DROP CONSTRAINT "navigation_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "_navigation_v" DROP CONSTRAINT "_navigation_v_version_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "_media_v" DROP CONSTRAINT "_media_v_version_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_folders_fk";
  
  DROP INDEX "home_presentations__order_idx";
  DROP INDEX "home_presentations_folder_idx";
  DROP INDEX "home_presentations_deleted_at_idx";
  DROP INDEX "_home_presentations_v_version_version__order_idx";
  DROP INDEX "_home_presentations_v_version_version_folder_idx";
  DROP INDEX "_home_presentations_v_version_version_deleted_at_idx";
  DROP INDEX "_home_presentations_v_snapshot_idx";
  DROP INDEX "_home_presentations_v_published_locale_idx";
  DROP INDEX "page_presentations__order_idx";
  DROP INDEX "page_presentations_folder_idx";
  DROP INDEX "page_presentations_deleted_at_idx";
  DROP INDEX "_page_presentations_v_version_version__order_idx";
  DROP INDEX "_page_presentations_v_version_version_folder_idx";
  DROP INDEX "_page_presentations_v_version_version_deleted_at_idx";
  DROP INDEX "_page_presentations_v_snapshot_idx";
  DROP INDEX "_page_presentations_v_published_locale_idx";
  DROP INDEX "navigation__order_idx";
  DROP INDEX "navigation_folder_idx";
  DROP INDEX "navigation_deleted_at_idx";
  DROP INDEX "_navigation_v_version_version__order_idx";
  DROP INDEX "_navigation_v_version_version_folder_idx";
  DROP INDEX "_navigation_v_version_version_deleted_at_idx";
  DROP INDEX "_navigation_v_snapshot_idx";
  DROP INDEX "_navigation_v_published_locale_idx";
  DROP INDEX "media__order_idx";
  DROP INDEX "media_folder_idx";
  DROP INDEX "media_deleted_at_idx";
  DROP INDEX "_media_v_version_version__order_idx";
  DROP INDEX "_media_v_version_version_folder_idx";
  DROP INDEX "_media_v_version_version_deleted_at_idx";
  DROP INDEX "users_deleted_at_idx";
  DROP INDEX "users_username_idx";
  DROP INDEX "avatars_deleted_at_idx";
  DROP INDEX "payload_locked_documents_rels_payload_folders_id_idx";
  ALTER TABLE "home_presentations" DROP COLUMN "_order";
  ALTER TABLE "home_presentations" DROP COLUMN "folder_id";
  ALTER TABLE "home_presentations" DROP COLUMN "deleted_at";
  ALTER TABLE "_home_presentations_v" DROP COLUMN "version__order";
  ALTER TABLE "_home_presentations_v" DROP COLUMN "version_folder_id";
  ALTER TABLE "_home_presentations_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_home_presentations_v" DROP COLUMN "snapshot";
  ALTER TABLE "_home_presentations_v" DROP COLUMN "published_locale";
  ALTER TABLE "page_presentations" DROP COLUMN "_order";
  ALTER TABLE "page_presentations" DROP COLUMN "folder_id";
  ALTER TABLE "page_presentations" DROP COLUMN "deleted_at";
  ALTER TABLE "_page_presentations_v" DROP COLUMN "version__order";
  ALTER TABLE "_page_presentations_v" DROP COLUMN "version_folder_id";
  ALTER TABLE "_page_presentations_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_page_presentations_v" DROP COLUMN "snapshot";
  ALTER TABLE "_page_presentations_v" DROP COLUMN "published_locale";
  ALTER TABLE "navigation" DROP COLUMN "_order";
  ALTER TABLE "navigation" DROP COLUMN "folder_id";
  ALTER TABLE "navigation" DROP COLUMN "deleted_at";
  ALTER TABLE "_navigation_v" DROP COLUMN "version__order";
  ALTER TABLE "_navigation_v" DROP COLUMN "version_folder_id";
  ALTER TABLE "_navigation_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_navigation_v" DROP COLUMN "snapshot";
  ALTER TABLE "_navigation_v" DROP COLUMN "published_locale";
  ALTER TABLE "media" DROP COLUMN "_order";
  ALTER TABLE "media" DROP COLUMN "folder_id";
  ALTER TABLE "media" DROP COLUMN "deleted_at";
  ALTER TABLE "_media_v" DROP COLUMN "version__order";
  ALTER TABLE "_media_v" DROP COLUMN "version_folder_id";
  ALTER TABLE "_media_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "users" DROP COLUMN "deleted_at";
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";
  ALTER TABLE "users" DROP COLUMN "username";
  ALTER TABLE "avatars" DROP COLUMN "deleted_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_folders_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__home_presentations_v_published_locale";
  DROP TYPE "public"."enum__page_presentations_v_published_locale";
  DROP TYPE "public"."enum__navigation_v_published_locale";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_log_parent_task_slug";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_payload_query_presets_access_read_constraint";
  DROP TYPE "public"."enum_payload_query_presets_access_update_constraint";
  DROP TYPE "public"."enum_payload_query_presets_access_delete_constraint";
  DROP TYPE "public"."enum_payload_query_presets_related_collection";`)
}
