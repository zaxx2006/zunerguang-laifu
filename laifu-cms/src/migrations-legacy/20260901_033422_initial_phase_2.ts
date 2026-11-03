import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_home_presentations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_presentations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update', 'delete', 'publish', 'unpublish');
  CREATE TYPE "public"."enum_publish_events_action" AS ENUM('publish', 'unpublish', 'delete');
  CREATE TYPE "public"."enum_publish_events_delivery_status" AS ENUM('queued', 'succeeded', 'failed');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"source_label" varchar NOT NULL,
  	"source_url" varchar,
  	"rights_confirmed" boolean DEFAULT false NOT NULL,
  	"public_approved" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar NOT NULL,
  	"version_caption" varchar,
  	"version_source_label" varchar NOT NULL,
  	"version_source_url" varchar,
  	"version_rights_confirmed" boolean DEFAULT false NOT NULL,
  	"version_public_approved" boolean DEFAULT false NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"version_sizes_thumbnail_url" varchar,
  	"version_sizes_thumbnail_width" numeric,
  	"version_sizes_thumbnail_height" numeric,
  	"version_sizes_thumbnail_mime_type" varchar,
  	"version_sizes_thumbnail_filesize" numeric,
  	"version_sizes_thumbnail_filename" varchar,
  	"version_sizes_card_url" varchar,
  	"version_sizes_card_width" numeric,
  	"version_sizes_card_height" numeric,
  	"version_sizes_card_mime_type" varchar,
  	"version_sizes_card_filesize" numeric,
  	"version_sizes_card_filename" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_presentations_hero_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_hero_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_opening_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar DEFAULT 'AceVec 首页',
  	"key" varchar DEFAULT 'home',
  	"hero_eyebrow_index" varchar,
  	"hero_eyebrow_label" varchar,
  	"hero_title_lead" varchar,
  	"hero_title_emphasis" varchar,
  	"hero_title_tail" varchar,
  	"hero_description" varchar,
  	"hero_primary_action_label" varchar,
  	"hero_primary_action_href" varchar,
  	"hero_secondary_action_label" varchar,
  	"hero_secondary_action_href" varchar,
  	"opening_eyebrow_index" varchar,
  	"opening_eyebrow_label" varchar,
  	"opening_description" varchar,
  	"opening_action_label" varchar,
  	"opening_action_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_home_presentations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_home_presentations_v_version_hero_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_hero_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_opening_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar DEFAULT 'AceVec 首页',
  	"version_key" varchar DEFAULT 'home',
  	"version_hero_eyebrow_index" varchar,
  	"version_hero_eyebrow_label" varchar,
  	"version_hero_title_lead" varchar,
  	"version_hero_title_emphasis" varchar,
  	"version_hero_title_tail" varchar,
  	"version_hero_description" varchar,
  	"version_hero_primary_action_label" varchar,
  	"version_hero_primary_action_href" varchar,
  	"version_hero_secondary_action_label" varchar,
  	"version_hero_secondary_action_href" varchar,
  	"version_opening_eyebrow_index" varchar,
  	"version_opening_eyebrow_label" varchar,
  	"version_opening_description" varchar,
  	"version_opening_action_label" varchar,
  	"version_opening_action_href" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__home_presentations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "navigation_groups_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"note" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation_groups_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "navigation_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"callout_eyebrow" varchar,
  	"callout_title" varchar,
  	"callout_action" varchar,
  	"callout_href" varchar
  );
  
  CREATE TABLE "navigation_top_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar DEFAULT 'AceVec 主导航',
  	"key" varchar DEFAULT 'primary',
  	"announcement_label" varchar,
  	"announcement_action_label" varchar,
  	"announcement_href" varchar,
  	"secondary_action_label" varchar,
  	"secondary_action_href" varchar,
  	"primary_action_label" varchar,
  	"primary_action_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_navigation_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_navigation_v_version_groups_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"note" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_groups_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"callout_eyebrow" varchar,
  	"callout_title" varchar,
  	"callout_action" varchar,
  	"callout_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_top_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar DEFAULT 'AceVec 主导航',
  	"version_key" varchar DEFAULT 'primary',
  	"version_announcement_label" varchar,
  	"version_announcement_action_label" varchar,
  	"version_announcement_href" varchar,
  	"version_secondary_action_label" varchar,
  	"version_secondary_action_href" varchar,
  	"version_primary_action_label" varchar,
  	"version_primary_action_href" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__navigation_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"changed_by_id" integer,
  	"action" "enum_audit_logs_action" NOT NULL,
  	"resource" varchar NOT NULL,
  	"document_id" varchar NOT NULL,
  	"status_before" varchar,
  	"status_after" varchar,
  	"request_id" varchar,
  	"changed_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "publish_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"resource" varchar NOT NULL,
  	"document_id" varchar NOT NULL,
  	"action" "enum_publish_events_action" NOT NULL,
  	"content_version" varchar NOT NULL,
  	"request_hash" varchar NOT NULL,
  	"idempotency_key" varchar NOT NULL,
  	"triggered_by_id" integer,
  	"delivery_status" "enum_publish_events_delivery_status" DEFAULT 'queued' NOT NULL,
  	"attempt_count" numeric DEFAULT 0 NOT NULL,
  	"last_attempt_at" timestamp(3) with time zone,
  	"response_status" numeric,
  	"last_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"home_presentations_id" integer,
  	"navigation_id" integer,
  	"audit_logs_id" integer,
  	"publish_events_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_presentations_hero_proof_points" ADD CONSTRAINT "home_presentations_hero_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_hero_rail" ADD CONSTRAINT "home_presentations_hero_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_opening_title_lines" ADD CONSTRAINT "home_presentations_opening_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_hero_proof_points" ADD CONSTRAINT "_home_presentations_v_version_hero_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_hero_rail" ADD CONSTRAINT "_home_presentations_v_version_hero_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_opening_title_lines" ADD CONSTRAINT "_home_presentations_v_version_opening_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v" ADD CONSTRAINT "_home_presentations_v_parent_id_home_presentations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_groups_columns_links" ADD CONSTRAINT "navigation_groups_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_groups_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_groups_columns" ADD CONSTRAINT "navigation_groups_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_groups" ADD CONSTRAINT "navigation_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_top_links" ADD CONSTRAINT "navigation_top_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_groups_columns_links" ADD CONSTRAINT "_navigation_v_version_groups_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_groups_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_groups_columns" ADD CONSTRAINT "_navigation_v_version_groups_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_groups" ADD CONSTRAINT "_navigation_v_version_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_top_links" ADD CONSTRAINT "_navigation_v_version_top_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v" ADD CONSTRAINT "_navigation_v_parent_id_navigation_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publish_events" ADD CONSTRAINT "publish_events_triggered_by_id_users_id_fk" FOREIGN KEY ("triggered_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_presentations_fk" FOREIGN KEY ("home_presentations_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_navigation_fk" FOREIGN KEY ("navigation_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publish_events_fk" FOREIGN KEY ("publish_events_id") REFERENCES "public"."publish_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_sizes_thumbnail_version_sizes_thumbnail_idx" ON "_media_v" USING btree ("version_sizes_thumbnail_filename");
  CREATE INDEX "_media_v_version_sizes_card_version_sizes_card_filename_idx" ON "_media_v" USING btree ("version_sizes_card_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "home_presentations_hero_proof_points_order_idx" ON "home_presentations_hero_proof_points" USING btree ("_order");
  CREATE INDEX "home_presentations_hero_proof_points_parent_id_idx" ON "home_presentations_hero_proof_points" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_hero_rail_order_idx" ON "home_presentations_hero_rail" USING btree ("_order");
  CREATE INDEX "home_presentations_hero_rail_parent_id_idx" ON "home_presentations_hero_rail" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_opening_title_lines_order_idx" ON "home_presentations_opening_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_opening_title_lines_parent_id_idx" ON "home_presentations_opening_title_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_presentations_key_idx" ON "home_presentations" USING btree ("key");
  CREATE INDEX "home_presentations_updated_at_idx" ON "home_presentations" USING btree ("updated_at");
  CREATE INDEX "home_presentations_created_at_idx" ON "home_presentations" USING btree ("created_at");
  CREATE INDEX "home_presentations__status_idx" ON "home_presentations" USING btree ("_status");
  CREATE INDEX "_home_presentations_v_version_hero_proof_points_order_idx" ON "_home_presentations_v_version_hero_proof_points" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_hero_proof_points_parent_id_idx" ON "_home_presentations_v_version_hero_proof_points" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_hero_rail_order_idx" ON "_home_presentations_v_version_hero_rail" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_hero_rail_parent_id_idx" ON "_home_presentations_v_version_hero_rail" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_opening_title_lines_order_idx" ON "_home_presentations_v_version_opening_title_lines" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_opening_title_lines_parent_id_idx" ON "_home_presentations_v_version_opening_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_parent_idx" ON "_home_presentations_v" USING btree ("parent_id");
  CREATE INDEX "_home_presentations_v_version_version_key_idx" ON "_home_presentations_v" USING btree ("version_key");
  CREATE INDEX "_home_presentations_v_version_version_updated_at_idx" ON "_home_presentations_v" USING btree ("version_updated_at");
  CREATE INDEX "_home_presentations_v_version_version_created_at_idx" ON "_home_presentations_v" USING btree ("version_created_at");
  CREATE INDEX "_home_presentations_v_version_version__status_idx" ON "_home_presentations_v" USING btree ("version__status");
  CREATE INDEX "_home_presentations_v_created_at_idx" ON "_home_presentations_v" USING btree ("created_at");
  CREATE INDEX "_home_presentations_v_updated_at_idx" ON "_home_presentations_v" USING btree ("updated_at");
  CREATE INDEX "_home_presentations_v_latest_idx" ON "_home_presentations_v" USING btree ("latest");
  CREATE INDEX "_home_presentations_v_autosave_idx" ON "_home_presentations_v" USING btree ("autosave");
  CREATE INDEX "navigation_groups_columns_links_order_idx" ON "navigation_groups_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_groups_columns_links_parent_id_idx" ON "navigation_groups_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_groups_columns_order_idx" ON "navigation_groups_columns" USING btree ("_order");
  CREATE INDEX "navigation_groups_columns_parent_id_idx" ON "navigation_groups_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_groups_order_idx" ON "navigation_groups" USING btree ("_order");
  CREATE INDEX "navigation_groups_parent_id_idx" ON "navigation_groups" USING btree ("_parent_id");
  CREATE INDEX "navigation_top_links_order_idx" ON "navigation_top_links" USING btree ("_order");
  CREATE INDEX "navigation_top_links_parent_id_idx" ON "navigation_top_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_key_idx" ON "navigation" USING btree ("key");
  CREATE INDEX "navigation_updated_at_idx" ON "navigation" USING btree ("updated_at");
  CREATE INDEX "navigation_created_at_idx" ON "navigation" USING btree ("created_at");
  CREATE INDEX "navigation__status_idx" ON "navigation" USING btree ("_status");
  CREATE INDEX "_navigation_v_version_groups_columns_links_order_idx" ON "_navigation_v_version_groups_columns_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_groups_columns_links_parent_id_idx" ON "_navigation_v_version_groups_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_groups_columns_order_idx" ON "_navigation_v_version_groups_columns" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_groups_columns_parent_id_idx" ON "_navigation_v_version_groups_columns" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_groups_order_idx" ON "_navigation_v_version_groups" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_groups_parent_id_idx" ON "_navigation_v_version_groups" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_top_links_order_idx" ON "_navigation_v_version_top_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_top_links_parent_id_idx" ON "_navigation_v_version_top_links" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_parent_idx" ON "_navigation_v" USING btree ("parent_id");
  CREATE INDEX "_navigation_v_version_version_key_idx" ON "_navigation_v" USING btree ("version_key");
  CREATE INDEX "_navigation_v_version_version_updated_at_idx" ON "_navigation_v" USING btree ("version_updated_at");
  CREATE INDEX "_navigation_v_version_version_created_at_idx" ON "_navigation_v" USING btree ("version_created_at");
  CREATE INDEX "_navigation_v_version_version__status_idx" ON "_navigation_v" USING btree ("version__status");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_latest_idx" ON "_navigation_v" USING btree ("latest");
  CREATE INDEX "_navigation_v_autosave_idx" ON "_navigation_v" USING btree ("autosave");
  CREATE INDEX "audit_logs_changed_by_idx" ON "audit_logs" USING btree ("changed_by_id");
  CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");
  CREATE INDEX "audit_logs_document_id_idx" ON "audit_logs" USING btree ("document_id");
  CREATE INDEX "audit_logs_changed_at_idx" ON "audit_logs" USING btree ("changed_at");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "publish_events_resource_idx" ON "publish_events" USING btree ("resource");
  CREATE INDEX "publish_events_document_id_idx" ON "publish_events" USING btree ("document_id");
  CREATE UNIQUE INDEX "publish_events_idempotency_key_idx" ON "publish_events" USING btree ("idempotency_key");
  CREATE INDEX "publish_events_triggered_by_idx" ON "publish_events" USING btree ("triggered_by_id");
  CREATE INDEX "publish_events_delivery_status_idx" ON "publish_events" USING btree ("delivery_status");
  CREATE INDEX "publish_events_updated_at_idx" ON "publish_events" USING btree ("updated_at");
  CREATE INDEX "publish_events_created_at_idx" ON "publish_events" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_home_presentations_id_idx" ON "payload_locked_documents_rels" USING btree ("home_presentations_id");
  CREATE INDEX "payload_locked_documents_rels_navigation_id_idx" ON "payload_locked_documents_rels" USING btree ("navigation_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_publish_events_id_idx" ON "payload_locked_documents_rels" USING btree ("publish_events_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "home_presentations_hero_proof_points" CASCADE;
  DROP TABLE "home_presentations_hero_rail" CASCADE;
  DROP TABLE "home_presentations_opening_title_lines" CASCADE;
  DROP TABLE "home_presentations" CASCADE;
  DROP TABLE "_home_presentations_v_version_hero_proof_points" CASCADE;
  DROP TABLE "_home_presentations_v_version_hero_rail" CASCADE;
  DROP TABLE "_home_presentations_v_version_opening_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v" CASCADE;
  DROP TABLE "navigation_groups_columns_links" CASCADE;
  DROP TABLE "navigation_groups_columns" CASCADE;
  DROP TABLE "navigation_groups" CASCADE;
  DROP TABLE "navigation_top_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "_navigation_v_version_groups_columns_links" CASCADE;
  DROP TABLE "_navigation_v_version_groups_columns" CASCADE;
  DROP TABLE "_navigation_v_version_groups" CASCADE;
  DROP TABLE "_navigation_v_version_top_links" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "publish_events" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_home_presentations_status";
  DROP TYPE "public"."enum__home_presentations_v_version_status";
  DROP TYPE "public"."enum_navigation_status";
  DROP TYPE "public"."enum__navigation_v_version_status";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum_publish_events_action";
  DROP TYPE "public"."enum_publish_events_delivery_status";`)
}
