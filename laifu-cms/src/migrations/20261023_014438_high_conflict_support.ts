import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."hc_enum_2" AS ENUM('safety', 'rest', 'children', 'contact', 'materials', 'housing', 'legal', 'network');
  CREATE TYPE "public"."hc_enum_8" AS ENUM('safety', 'rest', 'children', 'contact', 'materials', 'housing', 'legal', 'network');
  CREATE TYPE "public"."hc_enum_17" AS ENUM('situations', 'cycle', 'support', 'priorities', 'process', 'children', 'professionals', 'boundaries');
  ALTER TYPE "public"."enum_service_presentations_key" ADD VALUE 'high-conflict-divorce';
  ALTER TYPE "public"."enum__service_presentations_v_version_key" ADD VALUE 'high-conflict-divorce';
  CREATE TABLE "hc_a1" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"priority" "hc_enum_2"
  );
  
  CREATE TABLE "hc_a3" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"response" varchar
  );
  
  CREATE TABLE "hc_a5" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "hc_a6" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "hc_a4" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"title" varchar,
  	"situation" varchar,
  	"goal" varchar,
  	"tool_title" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "hc_a7" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "hc_enum_8",
  	"label" varchar,
  	"guidance" varchar,
  	"prompt" varchar
  );
  
  CREATE TABLE "hc_a9" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"discussion" varchar,
  	"result" varchar,
  	"next" varchar
  );
  
  CREATE TABLE "hc_a10" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "hc_a11" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "hc_a12" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dimension" varchar,
  	"coaching" varchar,
  	"therapy" varchar,
  	"legal" varchar,
  	"urgent" varchar
  );
  
  CREATE TABLE "hc_a13" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "hc_a14" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "hc_a15" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "hc_a16" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"section" "hc_enum_17"
  );
  
  CREATE TABLE "_hc_a1_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"priority" "hc_enum_2",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a3_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"response" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a5_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a6_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a4_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"title" varchar,
  	"situation" varchar,
  	"goal" varchar,
  	"tool_title" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a7_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "hc_enum_8",
  	"label" varchar,
  	"guidance" varchar,
  	"prompt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a9_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"discussion" varchar,
  	"result" varchar,
  	"next" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a10_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a11_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a12_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"dimension" varchar,
  	"coaching" varchar,
  	"therapy" varchar,
  	"legal" varchar,
  	"urgent" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a13_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a14_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a15_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hc_a16_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"section" "hc_enum_17",
  	"_uuid" varchar
  );
  
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_statement" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_audience" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_value" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_image_id" integer;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_caption" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_primary_action_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_primary_action_href" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_primary_action_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_secondary_action_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_secondary_action_href" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_hero_secondary_action_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_situations_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_situations_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_situations_note" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_situations_empty" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_situations_result_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_cycle_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_cycle_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_cycle_note" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_support_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_support_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_privacy" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_empty" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_summary_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_summary_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_copy_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_copied_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_copy_failed" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_priorities_clear_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_process_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_process_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_children_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_children_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_children_image_id" integer;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_children_caption" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_children_note" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_comparison_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_comparison_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_comparison_caption" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_outcomes_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_outcomes_intro" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_boundaries_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_boundaries_urgent" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_final_cta_title" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_final_cta_description" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_nav_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_situation_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_goal_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_work_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_discussion_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_result_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_next_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_selected_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_emergency_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_preview_label" varchar;
  ALTER TABLE "service_presentations" ADD COLUMN "high_conflict_ui_exit_preview" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_statement" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_audience" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_value" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_image_id" integer;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_caption" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_primary_action_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_primary_action_href" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_primary_action_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_secondary_action_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_secondary_action_href" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_hero_secondary_action_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_situations_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_situations_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_situations_note" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_situations_empty" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_situations_result_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_cycle_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_cycle_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_cycle_note" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_support_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_support_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_privacy" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_empty" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_summary_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_summary_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_copy_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_copied_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_copy_failed" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_priorities_clear_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_process_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_process_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_children_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_children_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_children_image_id" integer;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_children_caption" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_children_note" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_comparison_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_comparison_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_comparison_caption" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_outcomes_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_outcomes_intro" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_boundaries_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_boundaries_urgent" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_final_cta_title" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_final_cta_description" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_nav_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_situation_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_goal_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_work_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_discussion_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_result_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_next_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_selected_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_emergency_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_preview_label" varchar;
  ALTER TABLE "_service_presentations_v" ADD COLUMN "version_high_conflict_ui_exit_preview" varchar;
  ALTER TABLE "hc_a1" ADD CONSTRAINT "hc_a1_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a3" ADD CONSTRAINT "hc_a3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a5" ADD CONSTRAINT "hc_a5_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hc_a4"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a6" ADD CONSTRAINT "hc_a6_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hc_a4"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a4" ADD CONSTRAINT "hc_a4_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a7" ADD CONSTRAINT "hc_a7_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a9" ADD CONSTRAINT "hc_a9_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a10" ADD CONSTRAINT "hc_a10_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a11" ADD CONSTRAINT "hc_a11_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a12" ADD CONSTRAINT "hc_a12_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a13" ADD CONSTRAINT "hc_a13_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a14" ADD CONSTRAINT "hc_a14_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a15" ADD CONSTRAINT "hc_a15_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hc_a16" ADD CONSTRAINT "hc_a16_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a1_v" ADD CONSTRAINT "_hc_a1_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a3_v" ADD CONSTRAINT "_hc_a3_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a5_v" ADD CONSTRAINT "_hc_a5_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hc_a4_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a6_v" ADD CONSTRAINT "_hc_a6_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hc_a4_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a4_v" ADD CONSTRAINT "_hc_a4_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a7_v" ADD CONSTRAINT "_hc_a7_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a9_v" ADD CONSTRAINT "_hc_a9_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a10_v" ADD CONSTRAINT "_hc_a10_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a11_v" ADD CONSTRAINT "_hc_a11_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a12_v" ADD CONSTRAINT "_hc_a12_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a13_v" ADD CONSTRAINT "_hc_a13_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a14_v" ADD CONSTRAINT "_hc_a14_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a15_v" ADD CONSTRAINT "_hc_a15_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hc_a16_v" ADD CONSTRAINT "_hc_a16_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "hc_a1_order_idx" ON "hc_a1" USING btree ("_order");
  CREATE INDEX "hc_a1_parent_id_idx" ON "hc_a1" USING btree ("_parent_id");
  CREATE INDEX "hc_a3_order_idx" ON "hc_a3" USING btree ("_order");
  CREATE INDEX "hc_a3_parent_id_idx" ON "hc_a3" USING btree ("_parent_id");
  CREATE INDEX "hc_a5_order_idx" ON "hc_a5" USING btree ("_order");
  CREATE INDEX "hc_a5_parent_id_idx" ON "hc_a5" USING btree ("_parent_id");
  CREATE INDEX "hc_a6_order_idx" ON "hc_a6" USING btree ("_order");
  CREATE INDEX "hc_a6_parent_id_idx" ON "hc_a6" USING btree ("_parent_id");
  CREATE INDEX "hc_a4_order_idx" ON "hc_a4" USING btree ("_order");
  CREATE INDEX "hc_a4_parent_id_idx" ON "hc_a4" USING btree ("_parent_id");
  CREATE INDEX "hc_a7_order_idx" ON "hc_a7" USING btree ("_order");
  CREATE INDEX "hc_a7_parent_id_idx" ON "hc_a7" USING btree ("_parent_id");
  CREATE INDEX "hc_a9_order_idx" ON "hc_a9" USING btree ("_order");
  CREATE INDEX "hc_a9_parent_id_idx" ON "hc_a9" USING btree ("_parent_id");
  CREATE INDEX "hc_a10_order_idx" ON "hc_a10" USING btree ("_order");
  CREATE INDEX "hc_a10_parent_id_idx" ON "hc_a10" USING btree ("_parent_id");
  CREATE INDEX "hc_a11_order_idx" ON "hc_a11" USING btree ("_order");
  CREATE INDEX "hc_a11_parent_id_idx" ON "hc_a11" USING btree ("_parent_id");
  CREATE INDEX "hc_a12_order_idx" ON "hc_a12" USING btree ("_order");
  CREATE INDEX "hc_a12_parent_id_idx" ON "hc_a12" USING btree ("_parent_id");
  CREATE INDEX "hc_a13_order_idx" ON "hc_a13" USING btree ("_order");
  CREATE INDEX "hc_a13_parent_id_idx" ON "hc_a13" USING btree ("_parent_id");
  CREATE INDEX "hc_a14_order_idx" ON "hc_a14" USING btree ("_order");
  CREATE INDEX "hc_a14_parent_id_idx" ON "hc_a14" USING btree ("_parent_id");
  CREATE INDEX "hc_a15_order_idx" ON "hc_a15" USING btree ("_order");
  CREATE INDEX "hc_a15_parent_id_idx" ON "hc_a15" USING btree ("_parent_id");
  CREATE INDEX "hc_a16_order_idx" ON "hc_a16" USING btree ("_order");
  CREATE INDEX "hc_a16_parent_id_idx" ON "hc_a16" USING btree ("_parent_id");
  CREATE INDEX "_hc_a1_v_order_idx" ON "_hc_a1_v" USING btree ("_order");
  CREATE INDEX "_hc_a1_v_parent_id_idx" ON "_hc_a1_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a3_v_order_idx" ON "_hc_a3_v" USING btree ("_order");
  CREATE INDEX "_hc_a3_v_parent_id_idx" ON "_hc_a3_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a5_v_order_idx" ON "_hc_a5_v" USING btree ("_order");
  CREATE INDEX "_hc_a5_v_parent_id_idx" ON "_hc_a5_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a6_v_order_idx" ON "_hc_a6_v" USING btree ("_order");
  CREATE INDEX "_hc_a6_v_parent_id_idx" ON "_hc_a6_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a4_v_order_idx" ON "_hc_a4_v" USING btree ("_order");
  CREATE INDEX "_hc_a4_v_parent_id_idx" ON "_hc_a4_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a7_v_order_idx" ON "_hc_a7_v" USING btree ("_order");
  CREATE INDEX "_hc_a7_v_parent_id_idx" ON "_hc_a7_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a9_v_order_idx" ON "_hc_a9_v" USING btree ("_order");
  CREATE INDEX "_hc_a9_v_parent_id_idx" ON "_hc_a9_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a10_v_order_idx" ON "_hc_a10_v" USING btree ("_order");
  CREATE INDEX "_hc_a10_v_parent_id_idx" ON "_hc_a10_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a11_v_order_idx" ON "_hc_a11_v" USING btree ("_order");
  CREATE INDEX "_hc_a11_v_parent_id_idx" ON "_hc_a11_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a12_v_order_idx" ON "_hc_a12_v" USING btree ("_order");
  CREATE INDEX "_hc_a12_v_parent_id_idx" ON "_hc_a12_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a13_v_order_idx" ON "_hc_a13_v" USING btree ("_order");
  CREATE INDEX "_hc_a13_v_parent_id_idx" ON "_hc_a13_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a14_v_order_idx" ON "_hc_a14_v" USING btree ("_order");
  CREATE INDEX "_hc_a14_v_parent_id_idx" ON "_hc_a14_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a15_v_order_idx" ON "_hc_a15_v" USING btree ("_order");
  CREATE INDEX "_hc_a15_v_parent_id_idx" ON "_hc_a15_v" USING btree ("_parent_id");
  CREATE INDEX "_hc_a16_v_order_idx" ON "_hc_a16_v" USING btree ("_order");
  CREATE INDEX "_hc_a16_v_parent_id_idx" ON "_hc_a16_v" USING btree ("_parent_id");
  ALTER TABLE "service_presentations" ADD CONSTRAINT "service_presentations_high_conflict_hero_image_id_media_id_fk" FOREIGN KEY ("high_conflict_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_presentations" ADD CONSTRAINT "service_presentations_high_conflict_children_image_id_media_id_fk" FOREIGN KEY ("high_conflict_children_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_presentations_v" ADD CONSTRAINT "_service_presentations_v_version_high_conflict_hero_image_id_media_id_fk" FOREIGN KEY ("version_high_conflict_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_presentations_v" ADD CONSTRAINT "_service_presentations_v_version_high_conflict_children_image_id_media_id_fk" FOREIGN KEY ("version_high_conflict_children_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "service_presentations_high_conflict_hero_high_conflict_h_idx" ON "service_presentations" USING btree ("high_conflict_hero_image_id");
  CREATE INDEX "service_presentations_high_conflict_children_high_confli_idx" ON "service_presentations" USING btree ("high_conflict_children_image_id");
  CREATE INDEX "_service_presentations_v_version_high_conflict_hero_vers_idx" ON "_service_presentations_v" USING btree ("version_high_conflict_hero_image_id");
  CREATE INDEX "_service_presentations_v_version_high_conflict_children__idx" ON "_service_presentations_v" USING btree ("version_high_conflict_children_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hc_a1" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a3" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a5" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a6" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a4" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a7" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a9" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a10" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a11" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a12" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a13" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a14" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a15" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hc_a16" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a1_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a3_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a5_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a6_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a4_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a7_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a9_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a10_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a11_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a12_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a13_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a14_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a15_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hc_a16_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "hc_a1" CASCADE;
  DROP TABLE "hc_a3" CASCADE;
  DROP TABLE "hc_a5" CASCADE;
  DROP TABLE "hc_a6" CASCADE;
  DROP TABLE "hc_a4" CASCADE;
  DROP TABLE "hc_a7" CASCADE;
  DROP TABLE "hc_a9" CASCADE;
  DROP TABLE "hc_a10" CASCADE;
  DROP TABLE "hc_a11" CASCADE;
  DROP TABLE "hc_a12" CASCADE;
  DROP TABLE "hc_a13" CASCADE;
  DROP TABLE "hc_a14" CASCADE;
  DROP TABLE "hc_a15" CASCADE;
  DROP TABLE "hc_a16" CASCADE;
  DROP TABLE "_hc_a1_v" CASCADE;
  DROP TABLE "_hc_a3_v" CASCADE;
  DROP TABLE "_hc_a5_v" CASCADE;
  DROP TABLE "_hc_a6_v" CASCADE;
  DROP TABLE "_hc_a4_v" CASCADE;
  DROP TABLE "_hc_a7_v" CASCADE;
  DROP TABLE "_hc_a9_v" CASCADE;
  DROP TABLE "_hc_a10_v" CASCADE;
  DROP TABLE "_hc_a11_v" CASCADE;
  DROP TABLE "_hc_a12_v" CASCADE;
  DROP TABLE "_hc_a13_v" CASCADE;
  DROP TABLE "_hc_a14_v" CASCADE;
  DROP TABLE "_hc_a15_v" CASCADE;
  DROP TABLE "_hc_a16_v" CASCADE;
  ALTER TABLE "service_presentations" DROP CONSTRAINT "service_presentations_high_conflict_hero_image_id_media_id_fk";
  
  ALTER TABLE "service_presentations" DROP CONSTRAINT "service_presentations_high_conflict_children_image_id_media_id_fk";
  
  ALTER TABLE "_service_presentations_v" DROP CONSTRAINT "_service_presentations_v_version_high_conflict_hero_image_id_media_id_fk";
  
  ALTER TABLE "_service_presentations_v" DROP CONSTRAINT "_service_presentations_v_version_high_conflict_children_image_id_media_id_fk";
  
  ALTER TABLE "service_presentations" ALTER COLUMN "key" SET DATA TYPE text;
  DROP TYPE "public"."enum_service_presentations_key";
  CREATE TYPE "public"."enum_service_presentations_key" AS ENUM('divorce-coaching');
  ALTER TABLE "service_presentations" ALTER COLUMN "key" SET DATA TYPE "public"."enum_service_presentations_key" USING "key"::"public"."enum_service_presentations_key";
  ALTER TABLE "_service_presentations_v" ALTER COLUMN "version_key" SET DATA TYPE text;
  DROP TYPE "public"."enum__service_presentations_v_version_key";
  CREATE TYPE "public"."enum__service_presentations_v_version_key" AS ENUM('divorce-coaching');
  ALTER TABLE "_service_presentations_v" ALTER COLUMN "version_key" SET DATA TYPE "public"."enum__service_presentations_v_version_key" USING "version_key"::"public"."enum__service_presentations_v_version_key";
  DROP INDEX "service_presentations_high_conflict_hero_high_conflict_h_idx";
  DROP INDEX "service_presentations_high_conflict_children_high_confli_idx";
  DROP INDEX "_service_presentations_v_version_high_conflict_hero_vers_idx";
  DROP INDEX "_service_presentations_v_version_high_conflict_children__idx";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_statement";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_audience";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_value";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_image_id";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_caption";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_primary_action_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_primary_action_href";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_primary_action_open_in_new_tab";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_secondary_action_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_secondary_action_href";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_hero_secondary_action_open_in_new_tab";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_situations_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_situations_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_situations_note";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_situations_empty";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_situations_result_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_cycle_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_cycle_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_cycle_note";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_support_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_support_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_privacy";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_empty";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_summary_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_summary_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_copy_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_copied_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_copy_failed";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_priorities_clear_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_process_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_process_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_children_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_children_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_children_image_id";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_children_caption";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_children_note";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_comparison_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_comparison_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_comparison_caption";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_outcomes_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_outcomes_intro";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_boundaries_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_boundaries_urgent";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_final_cta_title";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_final_cta_description";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_nav_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_situation_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_goal_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_work_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_discussion_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_result_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_next_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_selected_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_emergency_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_preview_label";
  ALTER TABLE "service_presentations" DROP COLUMN "high_conflict_ui_exit_preview";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_statement";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_audience";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_value";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_image_id";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_caption";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_primary_action_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_primary_action_href";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_primary_action_open_in_new_tab";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_secondary_action_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_secondary_action_href";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_hero_secondary_action_open_in_new_tab";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_situations_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_situations_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_situations_note";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_situations_empty";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_situations_result_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_cycle_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_cycle_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_cycle_note";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_support_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_support_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_privacy";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_empty";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_summary_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_summary_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_copy_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_copied_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_copy_failed";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_priorities_clear_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_process_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_process_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_children_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_children_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_children_image_id";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_children_caption";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_children_note";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_comparison_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_comparison_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_comparison_caption";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_outcomes_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_outcomes_intro";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_boundaries_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_boundaries_urgent";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_final_cta_title";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_final_cta_description";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_nav_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_situation_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_goal_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_work_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_discussion_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_result_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_next_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_selected_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_emergency_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_preview_label";
  ALTER TABLE "_service_presentations_v" DROP COLUMN "version_high_conflict_ui_exit_preview";
  DROP TYPE "public"."hc_enum_2";
  DROP TYPE "public"."hc_enum_8";
  DROP TYPE "public"."hc_enum_17";`)
}
