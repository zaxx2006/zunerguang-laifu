import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_presentations_sections_key" AS ENUM('failure', 'services', 'method', 'evidence', 'fit', 'outcomes', 'insights', 'closing');
  CREATE TYPE "public"."enum__home_presentations_v_version_sections_key" AS ENUM('failure', 'services', 'method', 'evidence', 'fit', 'outcomes', 'insights', 'closing');
  CREATE TYPE "public"."enum_page_presentations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_presentations_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_presentations_sections_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_sections_markers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_sections_items_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_id" varchar,
  	"kicker" varchar,
  	"title" varchar,
  	"description" varchar,
  	"detail" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "home_presentations_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_home_presentations_sections_key",
  	"eyebrow_index" varchar,
  	"eyebrow_label" varchar,
  	"description" varchar,
  	"quote_text" varchar,
  	"quote_attribution" varchar,
  	"action_label" varchar,
  	"action_title" varchar,
  	"action_href" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_sections_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_sections_markers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_sections_items_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_id" varchar,
  	"kicker" varchar,
  	"title" varchar,
  	"description" varchar,
  	"detail" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__home_presentations_v_version_sections_key",
  	"eyebrow_index" varchar,
  	"eyebrow_label" varchar,
  	"description" varchar,
  	"quote_text" varchar,
  	"quote_attribution" varchar,
  	"action_label" varchar,
  	"action_title" varchar,
  	"action_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "page_presentations_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "page_presentations_sections_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "page_presentations_sections_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "page_presentations_sections_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "page_presentations_sections_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_presentations_sections_visual_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "page_presentations_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_id" varchar,
  	"visible" boolean DEFAULT true,
  	"label" varchar,
  	"title" varchar,
  	"visual_alt" varchar,
  	"visual_caption" varchar,
  	"visual_data_label" varchar
  );
  
  CREATE TABLE "page_presentations_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "page_presentations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar,
  	"route" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"direct_answer" varchar,
  	"cta_title" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_page_presentations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_page_presentations_v_version_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v_version_sections_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v_version_sections_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v_version_sections_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v_version_sections_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v_version_sections_visual_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_id" varchar,
  	"visible" boolean DEFAULT true,
  	"label" varchar,
  	"title" varchar,
  	"visual_alt" varchar,
  	"visual_caption" varchar,
  	"visual_data_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v_version_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_page_presentations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar,
  	"version_route" varchar,
  	"version_eyebrow" varchar,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_direct_answer" varchar,
  	"version_cta_title" varchar,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__page_presentations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "navigation" ADD COLUMN "footer_brand_label" varchar;
  ALTER TABLE "navigation" ADD COLUMN "footer_lead_title" varchar;
  ALTER TABLE "navigation" ADD COLUMN "footer_copyright" varchar;
  ALTER TABLE "navigation" ADD COLUMN "footer_tagline" varchar;
  ALTER TABLE "navigation" ADD COLUMN "footer_back_to_top_label" varchar;
  ALTER TABLE "_navigation_v" ADD COLUMN "version_footer_brand_label" varchar;
  ALTER TABLE "_navigation_v" ADD COLUMN "version_footer_lead_title" varchar;
  ALTER TABLE "_navigation_v" ADD COLUMN "version_footer_copyright" varchar;
  ALTER TABLE "_navigation_v" ADD COLUMN "version_footer_tagline" varchar;
  ALTER TABLE "_navigation_v" ADD COLUMN "version_footer_back_to_top_label" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_presentations_id" integer;
  ALTER TABLE "home_presentations_sections_title_lines" ADD CONSTRAINT "home_presentations_sections_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_sections_markers" ADD CONSTRAINT "home_presentations_sections_markers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_sections_items_points" ADD CONSTRAINT "home_presentations_sections_items_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_sections_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_sections_items" ADD CONSTRAINT "home_presentations_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_sections" ADD CONSTRAINT "home_presentations_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_sections_title_lines" ADD CONSTRAINT "_home_presentations_v_version_sections_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_sections_markers" ADD CONSTRAINT "_home_presentations_v_version_sections_markers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_sections_items_points" ADD CONSTRAINT "_home_presentations_v_version_sections_items_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_sections_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_sections_items" ADD CONSTRAINT "_home_presentations_v_version_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_sections" ADD CONSTRAINT "_home_presentations_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_sections_body" ADD CONSTRAINT "page_presentations_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_sections_points" ADD CONSTRAINT "page_presentations_sections_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_sections_table_columns" ADD CONSTRAINT "page_presentations_sections_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_sections_table_rows_cells" ADD CONSTRAINT "page_presentations_sections_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations_sections_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_sections_table_rows" ADD CONSTRAINT "page_presentations_sections_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_sections_visual_details" ADD CONSTRAINT "page_presentations_sections_visual_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_sections" ADD CONSTRAINT "page_presentations_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_presentations_related" ADD CONSTRAINT "page_presentations_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_body" ADD CONSTRAINT "_page_presentations_v_version_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_points" ADD CONSTRAINT "_page_presentations_v_version_sections_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_table_columns" ADD CONSTRAINT "_page_presentations_v_version_sections_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_table_rows_cells" ADD CONSTRAINT "_page_presentations_v_version_sections_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_table_rows" ADD CONSTRAINT "_page_presentations_v_version_sections_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_visual_details" ADD CONSTRAINT "_page_presentations_v_version_sections_visual_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections" ADD CONSTRAINT "_page_presentations_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_related" ADD CONSTRAINT "_page_presentations_v_version_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v" ADD CONSTRAINT "_page_presentations_v_parent_id_page_presentations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_presentations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_navigation_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns" ADD CONSTRAINT "_navigation_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_presentations_sections_title_lines_order_idx" ON "home_presentations_sections_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_sections_title_lines_parent_id_idx" ON "home_presentations_sections_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_sections_markers_order_idx" ON "home_presentations_sections_markers" USING btree ("_order");
  CREATE INDEX "home_presentations_sections_markers_parent_id_idx" ON "home_presentations_sections_markers" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_sections_items_points_order_idx" ON "home_presentations_sections_items_points" USING btree ("_order");
  CREATE INDEX "home_presentations_sections_items_points_parent_id_idx" ON "home_presentations_sections_items_points" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_sections_items_order_idx" ON "home_presentations_sections_items" USING btree ("_order");
  CREATE INDEX "home_presentations_sections_items_parent_id_idx" ON "home_presentations_sections_items" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_sections_order_idx" ON "home_presentations_sections" USING btree ("_order");
  CREATE INDEX "home_presentations_sections_parent_id_idx" ON "home_presentations_sections" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_sections_title_lines_order_idx" ON "_home_presentations_v_version_sections_title_lines" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_sections_title_lines_parent_id_idx" ON "_home_presentations_v_version_sections_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_sections_markers_order_idx" ON "_home_presentations_v_version_sections_markers" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_sections_markers_parent_id_idx" ON "_home_presentations_v_version_sections_markers" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_sections_items_points_order_idx" ON "_home_presentations_v_version_sections_items_points" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_sections_items_points_parent_id_idx" ON "_home_presentations_v_version_sections_items_points" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_sections_items_order_idx" ON "_home_presentations_v_version_sections_items" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_sections_items_parent_id_idx" ON "_home_presentations_v_version_sections_items" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_sections_order_idx" ON "_home_presentations_v_version_sections" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_sections_parent_id_idx" ON "_home_presentations_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_sections_body_order_idx" ON "page_presentations_sections_body" USING btree ("_order");
  CREATE INDEX "page_presentations_sections_body_parent_id_idx" ON "page_presentations_sections_body" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_sections_points_order_idx" ON "page_presentations_sections_points" USING btree ("_order");
  CREATE INDEX "page_presentations_sections_points_parent_id_idx" ON "page_presentations_sections_points" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_sections_table_columns_order_idx" ON "page_presentations_sections_table_columns" USING btree ("_order");
  CREATE INDEX "page_presentations_sections_table_columns_parent_id_idx" ON "page_presentations_sections_table_columns" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_sections_table_rows_cells_order_idx" ON "page_presentations_sections_table_rows_cells" USING btree ("_order");
  CREATE INDEX "page_presentations_sections_table_rows_cells_parent_id_idx" ON "page_presentations_sections_table_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_sections_table_rows_order_idx" ON "page_presentations_sections_table_rows" USING btree ("_order");
  CREATE INDEX "page_presentations_sections_table_rows_parent_id_idx" ON "page_presentations_sections_table_rows" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_sections_visual_details_order_idx" ON "page_presentations_sections_visual_details" USING btree ("_order");
  CREATE INDEX "page_presentations_sections_visual_details_parent_id_idx" ON "page_presentations_sections_visual_details" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_sections_order_idx" ON "page_presentations_sections" USING btree ("_order");
  CREATE INDEX "page_presentations_sections_parent_id_idx" ON "page_presentations_sections" USING btree ("_parent_id");
  CREATE INDEX "page_presentations_related_order_idx" ON "page_presentations_related" USING btree ("_order");
  CREATE INDEX "page_presentations_related_parent_id_idx" ON "page_presentations_related" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_presentations_route_idx" ON "page_presentations" USING btree ("route");
  CREATE INDEX "page_presentations_updated_at_idx" ON "page_presentations" USING btree ("updated_at");
  CREATE INDEX "page_presentations_created_at_idx" ON "page_presentations" USING btree ("created_at");
  CREATE INDEX "page_presentations__status_idx" ON "page_presentations" USING btree ("_status");
  CREATE INDEX "_page_presentations_v_version_sections_body_order_idx" ON "_page_presentations_v_version_sections_body" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_body_parent_id_idx" ON "_page_presentations_v_version_sections_body" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_points_order_idx" ON "_page_presentations_v_version_sections_points" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_points_parent_id_idx" ON "_page_presentations_v_version_sections_points" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_table_columns_order_idx" ON "_page_presentations_v_version_sections_table_columns" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_table_columns_parent_id_idx" ON "_page_presentations_v_version_sections_table_columns" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_table_rows_cells_order_idx" ON "_page_presentations_v_version_sections_table_rows_cells" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_table_rows_cells_parent_id_idx" ON "_page_presentations_v_version_sections_table_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_table_rows_order_idx" ON "_page_presentations_v_version_sections_table_rows" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_table_rows_parent_id_idx" ON "_page_presentations_v_version_sections_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_visual_details_order_idx" ON "_page_presentations_v_version_sections_visual_details" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_visual_details_parent_id_idx" ON "_page_presentations_v_version_sections_visual_details" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_order_idx" ON "_page_presentations_v_version_sections" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_parent_id_idx" ON "_page_presentations_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_related_order_idx" ON "_page_presentations_v_version_related" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_related_parent_id_idx" ON "_page_presentations_v_version_related" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_parent_idx" ON "_page_presentations_v" USING btree ("parent_id");
  CREATE INDEX "_page_presentations_v_version_version_route_idx" ON "_page_presentations_v" USING btree ("version_route");
  CREATE INDEX "_page_presentations_v_version_version_updated_at_idx" ON "_page_presentations_v" USING btree ("version_updated_at");
  CREATE INDEX "_page_presentations_v_version_version_created_at_idx" ON "_page_presentations_v" USING btree ("version_created_at");
  CREATE INDEX "_page_presentations_v_version_version__status_idx" ON "_page_presentations_v" USING btree ("version__status");
  CREATE INDEX "_page_presentations_v_created_at_idx" ON "_page_presentations_v" USING btree ("created_at");
  CREATE INDEX "_page_presentations_v_updated_at_idx" ON "_page_presentations_v" USING btree ("updated_at");
  CREATE INDEX "_page_presentations_v_latest_idx" ON "_page_presentations_v" USING btree ("latest");
  CREATE INDEX "_page_presentations_v_autosave_idx" ON "_page_presentations_v" USING btree ("autosave");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_footer_columns_links_order_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_links_parent_id_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_footer_columns_order_idx" ON "_navigation_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_parent_id_idx" ON "_navigation_v_version_footer_columns" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_presentations_fk" FOREIGN KEY ("page_presentations_id") REFERENCES "public"."page_presentations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_presentations_id_idx" ON "payload_locked_documents_rels" USING btree ("page_presentations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_presentations_sections_title_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_presentations_sections_markers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_presentations_sections_items_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_presentations_sections_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_presentations_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_presentations_v_version_sections_title_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_presentations_v_version_sections_markers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_presentations_v_version_sections_items_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_presentations_v_version_sections_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_presentations_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_sections_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_sections_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_sections_table_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_sections_table_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_sections_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_sections_visual_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations_related" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_presentations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_sections_body" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_sections_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_sections_table_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_sections_table_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_sections_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_sections_visual_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v_version_related" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_presentations_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_footer_columns" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_presentations_sections_title_lines" CASCADE;
  DROP TABLE "home_presentations_sections_markers" CASCADE;
  DROP TABLE "home_presentations_sections_items_points" CASCADE;
  DROP TABLE "home_presentations_sections_items" CASCADE;
  DROP TABLE "home_presentations_sections" CASCADE;
  DROP TABLE "_home_presentations_v_version_sections_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_sections_markers" CASCADE;
  DROP TABLE "_home_presentations_v_version_sections_items_points" CASCADE;
  DROP TABLE "_home_presentations_v_version_sections_items" CASCADE;
  DROP TABLE "_home_presentations_v_version_sections" CASCADE;
  DROP TABLE "page_presentations_sections_body" CASCADE;
  DROP TABLE "page_presentations_sections_points" CASCADE;
  DROP TABLE "page_presentations_sections_table_columns" CASCADE;
  DROP TABLE "page_presentations_sections_table_rows_cells" CASCADE;
  DROP TABLE "page_presentations_sections_table_rows" CASCADE;
  DROP TABLE "page_presentations_sections_visual_details" CASCADE;
  DROP TABLE "page_presentations_sections" CASCADE;
  DROP TABLE "page_presentations_related" CASCADE;
  DROP TABLE "page_presentations" CASCADE;
  DROP TABLE "_page_presentations_v_version_sections_body" CASCADE;
  DROP TABLE "_page_presentations_v_version_sections_points" CASCADE;
  DROP TABLE "_page_presentations_v_version_sections_table_columns" CASCADE;
  DROP TABLE "_page_presentations_v_version_sections_table_rows_cells" CASCADE;
  DROP TABLE "_page_presentations_v_version_sections_table_rows" CASCADE;
  DROP TABLE "_page_presentations_v_version_sections_visual_details" CASCADE;
  DROP TABLE "_page_presentations_v_version_sections" CASCADE;
  DROP TABLE "_page_presentations_v_version_related" CASCADE;
  DROP TABLE "_page_presentations_v" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_presentations_fk";
  
  DROP INDEX "payload_locked_documents_rels_page_presentations_id_idx";
  ALTER TABLE "navigation" DROP COLUMN "footer_brand_label";
  ALTER TABLE "navigation" DROP COLUMN "footer_lead_title";
  ALTER TABLE "navigation" DROP COLUMN "footer_copyright";
  ALTER TABLE "navigation" DROP COLUMN "footer_tagline";
  ALTER TABLE "navigation" DROP COLUMN "footer_back_to_top_label";
  ALTER TABLE "_navigation_v" DROP COLUMN "version_footer_brand_label";
  ALTER TABLE "_navigation_v" DROP COLUMN "version_footer_lead_title";
  ALTER TABLE "_navigation_v" DROP COLUMN "version_footer_copyright";
  ALTER TABLE "_navigation_v" DROP COLUMN "version_footer_tagline";
  ALTER TABLE "_navigation_v" DROP COLUMN "version_footer_back_to_top_label";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_presentations_id";
  DROP TYPE "public"."enum_home_presentations_sections_key";
  DROP TYPE "public"."enum__home_presentations_v_version_sections_key";
  DROP TYPE "public"."enum_page_presentations_status";
  DROP TYPE "public"."enum__page_presentations_v_version_status";`)
}
