import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."service_fit_direction" AS ENUM('emotional', 'preparation', 'rebuilding');
  CREATE TYPE "public"."enum_service_presentations_support_directions_key" AS ENUM('emotional', 'preparation', 'rebuilding');
  CREATE TYPE "public"."enum_service_presentations_key" AS ENUM('divorce-coaching');
  CREATE TYPE "public"."enum_service_presentations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_presentations_v_version_support_directions_key" AS ENUM('emotional', 'preparation', 'rebuilding');
  CREATE TYPE "public"."enum__service_presentations_v_version_key" AS ENUM('divorce-coaching');
  CREATE TYPE "public"."enum__service_presentations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_presentations_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TABLE "service_presentations_hero_statement_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_fit_intro_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_fit_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_fit_stages_concerns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_fit_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"support" varchar,
  	"support_direction" "service_fit_direction"
  );
  
  CREATE TABLE "service_presentations_why_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_support_intro_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_support_directions_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "service_presentations_support_directions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_service_presentations_support_directions_key",
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "service_presentations_support_reflections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "service_presentations_support_documents_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "service_presentations_support_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "service_presentations_support_life_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "service_presentations_process_steps_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_process_steps_map_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"short" varchar,
  	"intro" varchar,
  	"goal" varchar,
  	"map_title" varchar,
  	"map_end" varchar
  );
  
  CREATE TABLE "service_presentations_process_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "service_presentations_options_choices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_options_closing_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_comparison_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dimension" varchar,
  	"therapy" varchar,
  	"coaching" varchar,
  	"legal" varchar
  );
  
  CREATE TABLE "service_presentations_outcomes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_boundaries_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "service_presentations_final_cta_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "service_presentations_final_cta_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "service_presentations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar,
  	"key" "enum_service_presentations_key",
  	"hero_audience" varchar,
  	"hero_context" varchar,
  	"hero_image_id" integer,
  	"hero_caption" varchar,
  	"hero_primary_action_label" varchar,
  	"hero_primary_action_href" varchar,
  	"hero_primary_action_open_in_new_tab" boolean DEFAULT false,
  	"hero_secondary_action_label" varchar,
  	"hero_secondary_action_href" varchar,
  	"hero_secondary_action_open_in_new_tab" boolean DEFAULT false,
  	"fit_title" varchar,
  	"fit_note" varchar,
  	"why_title" varchar,
  	"why_statement" varchar,
  	"support_title" varchar,
  	"process_title" varchar,
  	"process_intro" varchar,
  	"process_modules_title" varchar,
  	"process_note" varchar,
  	"options_title" varchar,
  	"options_intro" varchar,
  	"options_action_label" varchar,
  	"options_action_href" varchar,
  	"options_action_open_in_new_tab" boolean DEFAULT false,
  	"comparison_title" varchar,
  	"comparison_intro" varchar,
  	"comparison_caption" varchar,
  	"outcomes_title" varchar,
  	"outcomes_intro" varchar,
  	"outcomes_closing" varchar,
  	"boundaries_title" varchar,
  	"boundaries_intro" varchar,
  	"boundaries_closing" varchar,
  	"final_cta_title" varchar,
  	"final_cta_assessment_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_service_presentations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_service_presentations_v_version_hero_statement_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_fit_intro_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_fit_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_fit_stages_concerns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_fit_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"support" varchar,
  	"support_direction" "service_fit_direction",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_why_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_support_intro_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_support_directions_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_support_directions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__service_presentations_v_version_support_directions_key",
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_support_reflections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_support_documents_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_support_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_support_life_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_process_steps_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_process_steps_map_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"short" varchar,
  	"intro" varchar,
  	"goal" varchar,
  	"map_title" varchar,
  	"map_end" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_process_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_options_choices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_options_closing_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_comparison_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"dimension" varchar,
  	"therapy" varchar,
  	"coaching" varchar,
  	"legal" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_outcomes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_boundaries_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_final_cta_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v_version_final_cta_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_presentations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar,
  	"version_key" "enum__service_presentations_v_version_key",
  	"version_hero_audience" varchar,
  	"version_hero_context" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_caption" varchar,
  	"version_hero_primary_action_label" varchar,
  	"version_hero_primary_action_href" varchar,
  	"version_hero_primary_action_open_in_new_tab" boolean DEFAULT false,
  	"version_hero_secondary_action_label" varchar,
  	"version_hero_secondary_action_href" varchar,
  	"version_hero_secondary_action_open_in_new_tab" boolean DEFAULT false,
  	"version_fit_title" varchar,
  	"version_fit_note" varchar,
  	"version_why_title" varchar,
  	"version_why_statement" varchar,
  	"version_support_title" varchar,
  	"version_process_title" varchar,
  	"version_process_intro" varchar,
  	"version_process_modules_title" varchar,
  	"version_process_note" varchar,
  	"version_options_title" varchar,
  	"version_options_intro" varchar,
  	"version_options_action_label" varchar,
  	"version_options_action_href" varchar,
  	"version_options_action_open_in_new_tab" boolean DEFAULT false,
  	"version_comparison_title" varchar,
  	"version_comparison_intro" varchar,
  	"version_comparison_caption" varchar,
  	"version_outcomes_title" varchar,
  	"version_outcomes_intro" varchar,
  	"version_outcomes_closing" varchar,
  	"version_boundaries_title" varchar,
  	"version_boundaries_intro" varchar,
  	"version_boundaries_closing" varchar,
  	"version_final_cta_title" varchar,
  	"version_final_cta_assessment_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__service_presentations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__service_presentations_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_presentations_id" integer;
  ALTER TABLE "service_presentations_hero_statement_lines" ADD CONSTRAINT "service_presentations_hero_statement_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_fit_intro_lines" ADD CONSTRAINT "service_presentations_fit_intro_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_fit_overview" ADD CONSTRAINT "service_presentations_fit_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_fit_stages_concerns" ADD CONSTRAINT "service_presentations_fit_stages_concerns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations_fit_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_fit_stages" ADD CONSTRAINT "service_presentations_fit_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_why_paragraphs" ADD CONSTRAINT "service_presentations_why_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_support_intro_lines" ADD CONSTRAINT "service_presentations_support_intro_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_support_directions_topics" ADD CONSTRAINT "service_presentations_support_directions_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations_support_directions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_support_directions" ADD CONSTRAINT "service_presentations_support_directions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_presentations_support_directions" ADD CONSTRAINT "service_presentations_support_directions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_support_reflections" ADD CONSTRAINT "service_presentations_support_reflections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_support_documents_rows" ADD CONSTRAINT "service_presentations_support_documents_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations_support_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_support_documents" ADD CONSTRAINT "service_presentations_support_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_support_life_areas" ADD CONSTRAINT "service_presentations_support_life_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_process_steps_focus" ADD CONSTRAINT "service_presentations_process_steps_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_process_steps_map_items" ADD CONSTRAINT "service_presentations_process_steps_map_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_process_steps" ADD CONSTRAINT "service_presentations_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_process_modules" ADD CONSTRAINT "service_presentations_process_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_options_choices" ADD CONSTRAINT "service_presentations_options_choices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_options_closing_lines" ADD CONSTRAINT "service_presentations_options_closing_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_comparison_headers" ADD CONSTRAINT "service_presentations_comparison_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_comparison_rows" ADD CONSTRAINT "service_presentations_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_outcomes_items" ADD CONSTRAINT "service_presentations_outcomes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_boundaries_items" ADD CONSTRAINT "service_presentations_boundaries_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_final_cta_description_lines" ADD CONSTRAINT "service_presentations_final_cta_description_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations_final_cta_actions" ADD CONSTRAINT "service_presentations_final_cta_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_presentations" ADD CONSTRAINT "service_presentations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_hero_statement_lines" ADD CONSTRAINT "_service_presentations_v_version_hero_statement_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_fit_intro_lines" ADD CONSTRAINT "_service_presentations_v_version_fit_intro_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_fit_overview" ADD CONSTRAINT "_service_presentations_v_version_fit_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_fit_stages_concerns" ADD CONSTRAINT "_service_presentations_v_version_fit_stages_concerns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v_version_fit_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_fit_stages" ADD CONSTRAINT "_service_presentations_v_version_fit_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_why_paragraphs" ADD CONSTRAINT "_service_presentations_v_version_why_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_intro_lines" ADD CONSTRAINT "_service_presentations_v_version_support_intro_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_directions_topics" ADD CONSTRAINT "_service_presentations_v_version_support_directions_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v_version_support_directions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_directions" ADD CONSTRAINT "_service_presentations_v_version_support_directions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_directions" ADD CONSTRAINT "_service_presentations_v_version_support_directions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_reflections" ADD CONSTRAINT "_service_presentations_v_version_support_reflections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_documents_rows" ADD CONSTRAINT "_service_presentations_v_version_support_documents_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v_version_support_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_documents" ADD CONSTRAINT "_service_presentations_v_version_support_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_support_life_areas" ADD CONSTRAINT "_service_presentations_v_version_support_life_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_process_steps_focus" ADD CONSTRAINT "_service_presentations_v_version_process_steps_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v_version_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_process_steps_map_items" ADD CONSTRAINT "_service_presentations_v_version_process_steps_map_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v_version_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_process_steps" ADD CONSTRAINT "_service_presentations_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_process_modules" ADD CONSTRAINT "_service_presentations_v_version_process_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_options_choices" ADD CONSTRAINT "_service_presentations_v_version_options_choices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_options_closing_lines" ADD CONSTRAINT "_service_presentations_v_version_options_closing_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_comparison_headers" ADD CONSTRAINT "_service_presentations_v_version_comparison_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_comparison_rows" ADD CONSTRAINT "_service_presentations_v_version_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_outcomes_items" ADD CONSTRAINT "_service_presentations_v_version_outcomes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_boundaries_items" ADD CONSTRAINT "_service_presentations_v_version_boundaries_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_final_cta_description_lines" ADD CONSTRAINT "_service_presentations_v_version_final_cta_description_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v_version_final_cta_actions" ADD CONSTRAINT "_service_presentations_v_version_final_cta_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_presentations_v" ADD CONSTRAINT "_service_presentations_v_parent_id_service_presentations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_presentations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_presentations_v" ADD CONSTRAINT "_service_presentations_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "service_presentations_hero_statement_lines_order_idx" ON "service_presentations_hero_statement_lines" USING btree ("_order");
  CREATE INDEX "service_presentations_hero_statement_lines_parent_id_idx" ON "service_presentations_hero_statement_lines" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_fit_intro_lines_order_idx" ON "service_presentations_fit_intro_lines" USING btree ("_order");
  CREATE INDEX "service_presentations_fit_intro_lines_parent_id_idx" ON "service_presentations_fit_intro_lines" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_fit_overview_order_idx" ON "service_presentations_fit_overview" USING btree ("_order");
  CREATE INDEX "service_presentations_fit_overview_parent_id_idx" ON "service_presentations_fit_overview" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_fit_stages_concerns_order_idx" ON "service_presentations_fit_stages_concerns" USING btree ("_order");
  CREATE INDEX "service_presentations_fit_stages_concerns_parent_id_idx" ON "service_presentations_fit_stages_concerns" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_fit_stages_order_idx" ON "service_presentations_fit_stages" USING btree ("_order");
  CREATE INDEX "service_presentations_fit_stages_parent_id_idx" ON "service_presentations_fit_stages" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_why_paragraphs_order_idx" ON "service_presentations_why_paragraphs" USING btree ("_order");
  CREATE INDEX "service_presentations_why_paragraphs_parent_id_idx" ON "service_presentations_why_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_support_intro_lines_order_idx" ON "service_presentations_support_intro_lines" USING btree ("_order");
  CREATE INDEX "service_presentations_support_intro_lines_parent_id_idx" ON "service_presentations_support_intro_lines" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_support_directions_topics_order_idx" ON "service_presentations_support_directions_topics" USING btree ("_order");
  CREATE INDEX "service_presentations_support_directions_topics_parent_id_idx" ON "service_presentations_support_directions_topics" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_support_directions_order_idx" ON "service_presentations_support_directions" USING btree ("_order");
  CREATE INDEX "service_presentations_support_directions_parent_id_idx" ON "service_presentations_support_directions" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_support_directions_image_idx" ON "service_presentations_support_directions" USING btree ("image_id");
  CREATE INDEX "service_presentations_support_reflections_order_idx" ON "service_presentations_support_reflections" USING btree ("_order");
  CREATE INDEX "service_presentations_support_reflections_parent_id_idx" ON "service_presentations_support_reflections" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_support_documents_rows_order_idx" ON "service_presentations_support_documents_rows" USING btree ("_order");
  CREATE INDEX "service_presentations_support_documents_rows_parent_id_idx" ON "service_presentations_support_documents_rows" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_support_documents_order_idx" ON "service_presentations_support_documents" USING btree ("_order");
  CREATE INDEX "service_presentations_support_documents_parent_id_idx" ON "service_presentations_support_documents" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_support_life_areas_order_idx" ON "service_presentations_support_life_areas" USING btree ("_order");
  CREATE INDEX "service_presentations_support_life_areas_parent_id_idx" ON "service_presentations_support_life_areas" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_process_steps_focus_order_idx" ON "service_presentations_process_steps_focus" USING btree ("_order");
  CREATE INDEX "service_presentations_process_steps_focus_parent_id_idx" ON "service_presentations_process_steps_focus" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_process_steps_map_items_order_idx" ON "service_presentations_process_steps_map_items" USING btree ("_order");
  CREATE INDEX "service_presentations_process_steps_map_items_parent_id_idx" ON "service_presentations_process_steps_map_items" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_process_steps_order_idx" ON "service_presentations_process_steps" USING btree ("_order");
  CREATE INDEX "service_presentations_process_steps_parent_id_idx" ON "service_presentations_process_steps" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_process_modules_order_idx" ON "service_presentations_process_modules" USING btree ("_order");
  CREATE INDEX "service_presentations_process_modules_parent_id_idx" ON "service_presentations_process_modules" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_options_choices_order_idx" ON "service_presentations_options_choices" USING btree ("_order");
  CREATE INDEX "service_presentations_options_choices_parent_id_idx" ON "service_presentations_options_choices" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_options_closing_lines_order_idx" ON "service_presentations_options_closing_lines" USING btree ("_order");
  CREATE INDEX "service_presentations_options_closing_lines_parent_id_idx" ON "service_presentations_options_closing_lines" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_comparison_headers_order_idx" ON "service_presentations_comparison_headers" USING btree ("_order");
  CREATE INDEX "service_presentations_comparison_headers_parent_id_idx" ON "service_presentations_comparison_headers" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_comparison_rows_order_idx" ON "service_presentations_comparison_rows" USING btree ("_order");
  CREATE INDEX "service_presentations_comparison_rows_parent_id_idx" ON "service_presentations_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_outcomes_items_order_idx" ON "service_presentations_outcomes_items" USING btree ("_order");
  CREATE INDEX "service_presentations_outcomes_items_parent_id_idx" ON "service_presentations_outcomes_items" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_boundaries_items_order_idx" ON "service_presentations_boundaries_items" USING btree ("_order");
  CREATE INDEX "service_presentations_boundaries_items_parent_id_idx" ON "service_presentations_boundaries_items" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_final_cta_description_lines_order_idx" ON "service_presentations_final_cta_description_lines" USING btree ("_order");
  CREATE INDEX "service_presentations_final_cta_description_lines_parent_id_idx" ON "service_presentations_final_cta_description_lines" USING btree ("_parent_id");
  CREATE INDEX "service_presentations_final_cta_actions_order_idx" ON "service_presentations_final_cta_actions" USING btree ("_order");
  CREATE INDEX "service_presentations_final_cta_actions_parent_id_idx" ON "service_presentations_final_cta_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_presentations_key_idx" ON "service_presentations" USING btree ("key");
  CREATE INDEX "service_presentations_hero_hero_image_idx" ON "service_presentations" USING btree ("hero_image_id");
  CREATE INDEX "service_presentations_updated_at_idx" ON "service_presentations" USING btree ("updated_at");
  CREATE INDEX "service_presentations_created_at_idx" ON "service_presentations" USING btree ("created_at");
  CREATE INDEX "service_presentations__status_idx" ON "service_presentations" USING btree ("_status");
  CREATE INDEX "_service_presentations_v_version_hero_statement_lines_order_idx" ON "_service_presentations_v_version_hero_statement_lines" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_hero_statement_lines_parent_id_idx" ON "_service_presentations_v_version_hero_statement_lines" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_fit_intro_lines_order_idx" ON "_service_presentations_v_version_fit_intro_lines" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_fit_intro_lines_parent_id_idx" ON "_service_presentations_v_version_fit_intro_lines" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_fit_overview_order_idx" ON "_service_presentations_v_version_fit_overview" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_fit_overview_parent_id_idx" ON "_service_presentations_v_version_fit_overview" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_fit_stages_concerns_order_idx" ON "_service_presentations_v_version_fit_stages_concerns" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_fit_stages_concerns_parent_id_idx" ON "_service_presentations_v_version_fit_stages_concerns" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_fit_stages_order_idx" ON "_service_presentations_v_version_fit_stages" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_fit_stages_parent_id_idx" ON "_service_presentations_v_version_fit_stages" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_why_paragraphs_order_idx" ON "_service_presentations_v_version_why_paragraphs" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_why_paragraphs_parent_id_idx" ON "_service_presentations_v_version_why_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_support_intro_lines_order_idx" ON "_service_presentations_v_version_support_intro_lines" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_support_intro_lines_parent_id_idx" ON "_service_presentations_v_version_support_intro_lines" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_support_directions_topics_order_idx" ON "_service_presentations_v_version_support_directions_topics" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_support_directions_topics_parent_id_idx" ON "_service_presentations_v_version_support_directions_topics" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_support_directions_order_idx" ON "_service_presentations_v_version_support_directions" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_support_directions_parent_id_idx" ON "_service_presentations_v_version_support_directions" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_support_directions_imag_idx" ON "_service_presentations_v_version_support_directions" USING btree ("image_id");
  CREATE INDEX "_service_presentations_v_version_support_reflections_order_idx" ON "_service_presentations_v_version_support_reflections" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_support_reflections_parent_id_idx" ON "_service_presentations_v_version_support_reflections" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_support_documents_rows_order_idx" ON "_service_presentations_v_version_support_documents_rows" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_support_documents_rows_parent_id_idx" ON "_service_presentations_v_version_support_documents_rows" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_support_documents_order_idx" ON "_service_presentations_v_version_support_documents" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_support_documents_parent_id_idx" ON "_service_presentations_v_version_support_documents" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_support_life_areas_order_idx" ON "_service_presentations_v_version_support_life_areas" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_support_life_areas_parent_id_idx" ON "_service_presentations_v_version_support_life_areas" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_process_steps_focus_order_idx" ON "_service_presentations_v_version_process_steps_focus" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_process_steps_focus_parent_id_idx" ON "_service_presentations_v_version_process_steps_focus" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_process_steps_map_items_order_idx" ON "_service_presentations_v_version_process_steps_map_items" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_process_steps_map_items_parent_id_idx" ON "_service_presentations_v_version_process_steps_map_items" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_process_steps_order_idx" ON "_service_presentations_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_process_steps_parent_id_idx" ON "_service_presentations_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_process_modules_order_idx" ON "_service_presentations_v_version_process_modules" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_process_modules_parent_id_idx" ON "_service_presentations_v_version_process_modules" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_options_choices_order_idx" ON "_service_presentations_v_version_options_choices" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_options_choices_parent_id_idx" ON "_service_presentations_v_version_options_choices" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_options_closing_lines_order_idx" ON "_service_presentations_v_version_options_closing_lines" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_options_closing_lines_parent_id_idx" ON "_service_presentations_v_version_options_closing_lines" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_comparison_headers_order_idx" ON "_service_presentations_v_version_comparison_headers" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_comparison_headers_parent_id_idx" ON "_service_presentations_v_version_comparison_headers" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_comparison_rows_order_idx" ON "_service_presentations_v_version_comparison_rows" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_comparison_rows_parent_id_idx" ON "_service_presentations_v_version_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_outcomes_items_order_idx" ON "_service_presentations_v_version_outcomes_items" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_outcomes_items_parent_id_idx" ON "_service_presentations_v_version_outcomes_items" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_boundaries_items_order_idx" ON "_service_presentations_v_version_boundaries_items" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_boundaries_items_parent_id_idx" ON "_service_presentations_v_version_boundaries_items" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_final_cta_description_lines_order_idx" ON "_service_presentations_v_version_final_cta_description_lines" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_final_cta_description_lines_parent_id_idx" ON "_service_presentations_v_version_final_cta_description_lines" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_version_final_cta_actions_order_idx" ON "_service_presentations_v_version_final_cta_actions" USING btree ("_order");
  CREATE INDEX "_service_presentations_v_version_final_cta_actions_parent_id_idx" ON "_service_presentations_v_version_final_cta_actions" USING btree ("_parent_id");
  CREATE INDEX "_service_presentations_v_parent_idx" ON "_service_presentations_v" USING btree ("parent_id");
  CREATE INDEX "_service_presentations_v_version_version_key_idx" ON "_service_presentations_v" USING btree ("version_key");
  CREATE INDEX "_service_presentations_v_version_hero_version_hero_image_idx" ON "_service_presentations_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_service_presentations_v_version_version_updated_at_idx" ON "_service_presentations_v" USING btree ("version_updated_at");
  CREATE INDEX "_service_presentations_v_version_version_created_at_idx" ON "_service_presentations_v" USING btree ("version_created_at");
  CREATE INDEX "_service_presentations_v_version_version__status_idx" ON "_service_presentations_v" USING btree ("version__status");
  CREATE INDEX "_service_presentations_v_created_at_idx" ON "_service_presentations_v" USING btree ("created_at");
  CREATE INDEX "_service_presentations_v_updated_at_idx" ON "_service_presentations_v" USING btree ("updated_at");
  CREATE INDEX "_service_presentations_v_snapshot_idx" ON "_service_presentations_v" USING btree ("snapshot");
  CREATE INDEX "_service_presentations_v_published_locale_idx" ON "_service_presentations_v" USING btree ("published_locale");
  CREATE INDEX "_service_presentations_v_latest_idx" ON "_service_presentations_v" USING btree ("latest");
  CREATE INDEX "_service_presentations_v_autosave_idx" ON "_service_presentations_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_presentations_fk" FOREIGN KEY ("service_presentations_id") REFERENCES "public"."service_presentations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_service_presentations_id_idx" ON "payload_locked_documents_rels" USING btree ("service_presentations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service_presentations_hero_statement_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_fit_intro_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_fit_overview" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_fit_stages_concerns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_fit_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_why_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_support_intro_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_support_directions_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_support_directions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_support_reflections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_support_documents_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_support_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_support_life_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_process_steps_focus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_process_steps_map_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_process_modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_options_choices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_options_closing_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_comparison_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_comparison_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_outcomes_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_boundaries_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_final_cta_description_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations_final_cta_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_presentations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_hero_statement_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_fit_intro_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_fit_overview" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_fit_stages_concerns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_fit_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_why_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_support_intro_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_support_directions_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_support_directions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_support_reflections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_support_documents_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_support_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_support_life_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_process_steps_focus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_process_steps_map_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_process_modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_options_choices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_options_closing_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_comparison_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_comparison_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_outcomes_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_boundaries_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_final_cta_description_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v_version_final_cta_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_presentations_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "service_presentations_hero_statement_lines" CASCADE;
  DROP TABLE "service_presentations_fit_intro_lines" CASCADE;
  DROP TABLE "service_presentations_fit_overview" CASCADE;
  DROP TABLE "service_presentations_fit_stages_concerns" CASCADE;
  DROP TABLE "service_presentations_fit_stages" CASCADE;
  DROP TABLE "service_presentations_why_paragraphs" CASCADE;
  DROP TABLE "service_presentations_support_intro_lines" CASCADE;
  DROP TABLE "service_presentations_support_directions_topics" CASCADE;
  DROP TABLE "service_presentations_support_directions" CASCADE;
  DROP TABLE "service_presentations_support_reflections" CASCADE;
  DROP TABLE "service_presentations_support_documents_rows" CASCADE;
  DROP TABLE "service_presentations_support_documents" CASCADE;
  DROP TABLE "service_presentations_support_life_areas" CASCADE;
  DROP TABLE "service_presentations_process_steps_focus" CASCADE;
  DROP TABLE "service_presentations_process_steps_map_items" CASCADE;
  DROP TABLE "service_presentations_process_steps" CASCADE;
  DROP TABLE "service_presentations_process_modules" CASCADE;
  DROP TABLE "service_presentations_options_choices" CASCADE;
  DROP TABLE "service_presentations_options_closing_lines" CASCADE;
  DROP TABLE "service_presentations_comparison_headers" CASCADE;
  DROP TABLE "service_presentations_comparison_rows" CASCADE;
  DROP TABLE "service_presentations_outcomes_items" CASCADE;
  DROP TABLE "service_presentations_boundaries_items" CASCADE;
  DROP TABLE "service_presentations_final_cta_description_lines" CASCADE;
  DROP TABLE "service_presentations_final_cta_actions" CASCADE;
  DROP TABLE "service_presentations" CASCADE;
  DROP TABLE "_service_presentations_v_version_hero_statement_lines" CASCADE;
  DROP TABLE "_service_presentations_v_version_fit_intro_lines" CASCADE;
  DROP TABLE "_service_presentations_v_version_fit_overview" CASCADE;
  DROP TABLE "_service_presentations_v_version_fit_stages_concerns" CASCADE;
  DROP TABLE "_service_presentations_v_version_fit_stages" CASCADE;
  DROP TABLE "_service_presentations_v_version_why_paragraphs" CASCADE;
  DROP TABLE "_service_presentations_v_version_support_intro_lines" CASCADE;
  DROP TABLE "_service_presentations_v_version_support_directions_topics" CASCADE;
  DROP TABLE "_service_presentations_v_version_support_directions" CASCADE;
  DROP TABLE "_service_presentations_v_version_support_reflections" CASCADE;
  DROP TABLE "_service_presentations_v_version_support_documents_rows" CASCADE;
  DROP TABLE "_service_presentations_v_version_support_documents" CASCADE;
  DROP TABLE "_service_presentations_v_version_support_life_areas" CASCADE;
  DROP TABLE "_service_presentations_v_version_process_steps_focus" CASCADE;
  DROP TABLE "_service_presentations_v_version_process_steps_map_items" CASCADE;
  DROP TABLE "_service_presentations_v_version_process_steps" CASCADE;
  DROP TABLE "_service_presentations_v_version_process_modules" CASCADE;
  DROP TABLE "_service_presentations_v_version_options_choices" CASCADE;
  DROP TABLE "_service_presentations_v_version_options_closing_lines" CASCADE;
  DROP TABLE "_service_presentations_v_version_comparison_headers" CASCADE;
  DROP TABLE "_service_presentations_v_version_comparison_rows" CASCADE;
  DROP TABLE "_service_presentations_v_version_outcomes_items" CASCADE;
  DROP TABLE "_service_presentations_v_version_boundaries_items" CASCADE;
  DROP TABLE "_service_presentations_v_version_final_cta_description_lines" CASCADE;
  DROP TABLE "_service_presentations_v_version_final_cta_actions" CASCADE;
  DROP TABLE "_service_presentations_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_presentations_fk";
  
  DROP INDEX "payload_locked_documents_rels_service_presentations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_presentations_id";
  DROP TYPE "public"."service_fit_direction";
  DROP TYPE "public"."enum_service_presentations_support_directions_key";
  DROP TYPE "public"."enum_service_presentations_key";
  DROP TYPE "public"."enum_service_presentations_status";
  DROP TYPE "public"."enum__service_presentations_v_version_support_directions_key";
  DROP TYPE "public"."enum__service_presentations_v_version_key";
  DROP TYPE "public"."enum__service_presentations_v_version_status";
  DROP TYPE "public"."enum__service_presentations_v_published_locale";`)
}
