import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum_page_presentations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_presentations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_presentations_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum_home_presentations_journey_stages_key" AS ENUM('stabilize', 'clarify', 'decide', 'action', 'followup');
  CREATE TYPE "public"."enum_home_presentations_services_items_key" AS ENUM('coaching', 'highConflict', 'courses', 'community', 'academy');
  CREATE TYPE "public"."enum_home_presentations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_presentations_v_version_journey_stages_key" AS ENUM('stabilize', 'clarify', 'decide', 'action', 'followup');
  CREATE TYPE "public"."enum__home_presentations_v_version_services_items_key" AS ENUM('coaching', 'highConflict', 'courses', 'community', 'academy');
  CREATE TYPE "public"."enum__home_presentations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_presentations_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_published_locale" AS ENUM('zh-CN', 'en');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'publisher', 'editor');
  CREATE TYPE "public"."enum_publish_events_action" AS ENUM('publish', 'unpublish', 'delete');
  CREATE TYPE "public"."enum_publish_events_delivery_status" AS ENUM('queued', 'succeeded', 'failed');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update', 'delete', 'publish', 'unpublish');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_log_parent_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
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
  	"cta_open_in_new_tab" boolean DEFAULT false,
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
  	"version_cta_open_in_new_tab" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__page_presentations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__page_presentations_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "home_presentations_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_hero_intro_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_journey_opening_body_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_journey_stages_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_journey_stages_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_journey_stages_document_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"marker" varchar,
  	"text" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "home_presentations_journey_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_home_presentations_journey_stages_key",
  	"step_label" varchar,
  	"document_label" varchar
  );
  
  CREATE TABLE "home_presentations_services_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_services_items_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_home_presentations_services_items_key",
  	"description" varchar,
  	"action_label" varchar,
  	"href" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "home_presentations_assessment_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_assessment_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_faq_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_guides_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_guides_items_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_guides_items_subtitle_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_guides_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"image_id" integer,
  	"meta" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "home_presentations_invitation_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_presentations_invitation_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "home_presentations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar DEFAULT '来福官网首页',
  	"key" varchar DEFAULT 'home',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_share_image_id" integer,
  	"hero_image_id" integer,
  	"hero_search_placeholder" varchar,
  	"hero_primary_action_label" varchar,
  	"hero_primary_action_href" varchar,
  	"hero_primary_action_open_in_new_tab" boolean DEFAULT false,
  	"hero_secondary_action_label" varchar,
  	"hero_secondary_action_href" varchar,
  	"hero_secondary_action_open_in_new_tab" boolean DEFAULT false,
  	"hero_journey_link_label" varchar,
  	"hero_journey_summary" varchar,
  	"journey_opening_title" varchar,
  	"journey_caption" varchar,
  	"services_caption_left" varchar,
  	"services_caption_right" varchar,
  	"assessment_action_label" varchar,
  	"assessment_action_href" varchar,
  	"assessment_action_open_in_new_tab" boolean DEFAULT false,
  	"assessment_note" varchar,
  	"faq_index_action_label" varchar,
  	"faq_index_action_href" varchar,
  	"faq_index_action_open_in_new_tab" boolean DEFAULT false,
  	"faq_contact_action_label" varchar,
  	"faq_contact_action_href" varchar,
  	"faq_contact_action_open_in_new_tab" boolean DEFAULT false,
  	"guides_description" varchar,
  	"guides_status_note" varchar,
  	"guides_index_action_label" varchar,
  	"guides_index_action_href" varchar,
  	"guides_index_action_open_in_new_tab" boolean DEFAULT false,
  	"invitation_title" varchar,
  	"invitation_assessment_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_home_presentations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "home_presentations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_home_presentations_v_version_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_hero_intro_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_journey_opening_body_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_journey_stages_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_journey_stages_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_journey_stages_document_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"marker" varchar,
  	"text" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_journey_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__home_presentations_v_version_journey_stages_key",
  	"step_label" varchar,
  	"document_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_services_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_services_items_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__home_presentations_v_version_services_items_key",
  	"description" varchar,
  	"action_label" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_assessment_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_assessment_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_faq_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_guides_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_guides_items_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_guides_items_subtitle_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_guides_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"image_id" integer,
  	"meta" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_invitation_description_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v_version_invitation_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_presentations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar DEFAULT '来福官网首页',
  	"version_key" varchar DEFAULT 'home',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_share_image_id" integer,
  	"version_hero_image_id" integer,
  	"version_hero_search_placeholder" varchar,
  	"version_hero_primary_action_label" varchar,
  	"version_hero_primary_action_href" varchar,
  	"version_hero_primary_action_open_in_new_tab" boolean DEFAULT false,
  	"version_hero_secondary_action_label" varchar,
  	"version_hero_secondary_action_href" varchar,
  	"version_hero_secondary_action_open_in_new_tab" boolean DEFAULT false,
  	"version_hero_journey_link_label" varchar,
  	"version_hero_journey_summary" varchar,
  	"version_journey_opening_title" varchar,
  	"version_journey_caption" varchar,
  	"version_services_caption_left" varchar,
  	"version_services_caption_right" varchar,
  	"version_assessment_action_label" varchar,
  	"version_assessment_action_href" varchar,
  	"version_assessment_action_open_in_new_tab" boolean DEFAULT false,
  	"version_assessment_note" varchar,
  	"version_faq_index_action_label" varchar,
  	"version_faq_index_action_href" varchar,
  	"version_faq_index_action_open_in_new_tab" boolean DEFAULT false,
  	"version_faq_contact_action_label" varchar,
  	"version_faq_contact_action_href" varchar,
  	"version_faq_contact_action_open_in_new_tab" boolean DEFAULT false,
  	"version_guides_description" varchar,
  	"version_guides_status_note" varchar,
  	"version_guides_index_action_label" varchar,
  	"version_guides_index_action_href" varchar,
  	"version_guides_index_action_open_in_new_tab" boolean DEFAULT false,
  	"version_invitation_title" varchar,
  	"version_invitation_assessment_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__home_presentations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_presentations_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_home_presentations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer
  );
  
  CREATE TABLE "faqs_contexts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"copy" varchar,
  	"has_action" boolean DEFAULT false,
  	"action_label" varchar,
  	"action_href" varchar,
  	"action_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "faqs_followups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"lead" varchar,
  	"answer" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faqs_v_version_contexts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"copy" varchar,
  	"has_action" boolean DEFAULT false,
  	"action_label" varchar,
  	"action_href" varchar,
  	"action_open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faqs_v_version_followups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_question" varchar,
  	"version_lead" varchar,
  	"version_answer" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__faqs_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "navigation_primary_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar DEFAULT '来福主导航与页脚',
  	"key" varchar DEFAULT 'primary',
  	"home_href" varchar DEFAULT '#home',
  	"assessment_action_label" varchar,
  	"assessment_action_href" varchar,
  	"assessment_action_open_in_new_tab" boolean DEFAULT false,
  	"footer_statement" varchar,
  	"footer_disclaimer" varchar,
  	"copyright" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_navigation_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_navigation_v_version_primary_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar DEFAULT '来福主导航与页脚',
  	"version_key" varchar DEFAULT 'primary',
  	"version_home_href" varchar DEFAULT '#home',
  	"version_assessment_action_label" varchar,
  	"version_assessment_action_href" varchar,
  	"version_assessment_action_open_in_new_tab" boolean DEFAULT false,
  	"version_footer_statement" varchar,
  	"version_footer_disclaimer" varchar,
  	"version_copyright" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__navigation_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__navigation_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"source_label" varchar NOT NULL,
  	"source_url" varchar,
  	"rights_confirmed" boolean DEFAULT false NOT NULL,
  	"public_approved" boolean DEFAULT false NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
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
  	"version_folder_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
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
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"username" varchar,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "avatars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_id" integer,
  	"alt" varchar DEFAULT '用户头像' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_avatar_url" varchar,
  	"sizes_avatar_width" numeric,
  	"sizes_avatar_height" numeric,
  	"sizes_avatar_mime_type" varchar,
  	"sizes_avatar_filesize" numeric,
  	"sizes_avatar_filename" varchar
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
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
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
  	"page_presentations_id" integer,
  	"home_presentations_id" integer,
  	"faqs_id" integer,
  	"navigation_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"avatars_id" integer,
  	"publish_events_id" integer,
  	"audit_logs_id" integer,
  	"payload_folders_id" integer
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
  ALTER TABLE "_page_presentations_v_version_sections_table_columns" ADD CONSTRAINT "ppv_table_columns_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_table_rows_cells" ADD CONSTRAINT "ppv_table_cells_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_table_rows" ADD CONSTRAINT "_page_presentations_v_version_sections_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections_visual_details" ADD CONSTRAINT "ppv_visual_details_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_sections" ADD CONSTRAINT "_page_presentations_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v_version_related" ADD CONSTRAINT "_page_presentations_v_version_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_presentations_v" ADD CONSTRAINT "_page_presentations_v_parent_id_page_presentations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_presentations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_presentations_hero_title_lines" ADD CONSTRAINT "home_presentations_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_hero_intro_lines" ADD CONSTRAINT "home_presentations_hero_intro_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_journey_opening_body_lines" ADD CONSTRAINT "home_presentations_journey_opening_body_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_journey_stages_title_lines" ADD CONSTRAINT "home_presentations_journey_stages_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_journey_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_journey_stages_description_lines" ADD CONSTRAINT "home_presentations_journey_stages_description_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_journey_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_journey_stages_document_items" ADD CONSTRAINT "home_presentations_journey_stages_document_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_journey_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_journey_stages" ADD CONSTRAINT "home_presentations_journey_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_services_title_lines" ADD CONSTRAINT "home_presentations_services_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_services_items_title_lines" ADD CONSTRAINT "home_presentations_services_items_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_services_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_services_items" ADD CONSTRAINT "home_presentations_services_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_presentations_services_items" ADD CONSTRAINT "home_presentations_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_assessment_title_lines" ADD CONSTRAINT "home_presentations_assessment_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_assessment_description_lines" ADD CONSTRAINT "home_presentations_assessment_description_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_faq_heading_lines" ADD CONSTRAINT "home_presentations_faq_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_guides_title_lines" ADD CONSTRAINT "home_presentations_guides_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_guides_items_title_lines" ADD CONSTRAINT "home_presentations_guides_items_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_guides_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_guides_items_subtitle_lines" ADD CONSTRAINT "home_presentations_guides_items_subtitle_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations_guides_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_guides_items" ADD CONSTRAINT "home_presentations_guides_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_presentations_guides_items" ADD CONSTRAINT "home_presentations_guides_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_invitation_description_lines" ADD CONSTRAINT "home_presentations_invitation_description_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_invitation_actions" ADD CONSTRAINT "home_presentations_invitation_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations" ADD CONSTRAINT "home_presentations_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_presentations" ADD CONSTRAINT "home_presentations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_presentations_rels" ADD CONSTRAINT "home_presentations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_presentations_rels" ADD CONSTRAINT "home_presentations_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_hero_title_lines" ADD CONSTRAINT "_home_presentations_v_version_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_hero_intro_lines" ADD CONSTRAINT "_home_presentations_v_version_hero_intro_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_journey_opening_body_lines" ADD CONSTRAINT "hpv_journey_opening_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_journey_stages_title_lines" ADD CONSTRAINT "hpv_journey_title_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_journey_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_journey_stages_description_lines" ADD CONSTRAINT "hpv_journey_stage_desc_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_journey_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_journey_stages_document_items" ADD CONSTRAINT "hpv_journey_docs_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_journey_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_journey_stages" ADD CONSTRAINT "_home_presentations_v_version_journey_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_services_title_lines" ADD CONSTRAINT "_home_presentations_v_version_services_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_services_items_title_lines" ADD CONSTRAINT "hpv_service_title_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_services_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_services_items" ADD CONSTRAINT "_home_presentations_v_version_services_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_services_items" ADD CONSTRAINT "_home_presentations_v_version_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_assessment_title_lines" ADD CONSTRAINT "hpv_assessment_title_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_assessment_description_lines" ADD CONSTRAINT "hpv_assessment_desc_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_faq_heading_lines" ADD CONSTRAINT "_home_presentations_v_version_faq_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_guides_title_lines" ADD CONSTRAINT "_home_presentations_v_version_guides_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_guides_items_title_lines" ADD CONSTRAINT "hpv_guide_title_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_guides_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_guides_items_subtitle_lines" ADD CONSTRAINT "hpv_guide_subtitle_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v_version_guides_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_guides_items" ADD CONSTRAINT "_home_presentations_v_version_guides_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_guides_items" ADD CONSTRAINT "_home_presentations_v_version_guides_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_invitation_description_lines" ADD CONSTRAINT "hpv_invitation_desc_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_version_invitation_actions" ADD CONSTRAINT "_home_presentations_v_version_invitation_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v" ADD CONSTRAINT "_home_presentations_v_parent_id_home_presentations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_presentations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_presentations_v" ADD CONSTRAINT "_home_presentations_v_version_seo_share_image_id_media_id_fk" FOREIGN KEY ("version_seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_presentations_v" ADD CONSTRAINT "_home_presentations_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_rels" ADD CONSTRAINT "_home_presentations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_presentations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_presentations_v_rels" ADD CONSTRAINT "_home_presentations_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_contexts" ADD CONSTRAINT "faqs_contexts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_followups" ADD CONSTRAINT "faqs_followups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_version_contexts" ADD CONSTRAINT "_faqs_v_version_contexts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_version_followups" ADD CONSTRAINT "_faqs_v_version_followups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_primary_links" ADD CONSTRAINT "navigation_primary_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_primary_links" ADD CONSTRAINT "_navigation_v_version_primary_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_navigation_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns" ADD CONSTRAINT "_navigation_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v" ADD CONSTRAINT "_navigation_v_parent_id_navigation_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version_folder_id_payload_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publish_events" ADD CONSTRAINT "publish_events_triggered_by_id_users_id_fk" FOREIGN KEY ("triggered_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_presentations_fk" FOREIGN KEY ("page_presentations_id") REFERENCES "public"."page_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_presentations_fk" FOREIGN KEY ("home_presentations_id") REFERENCES "public"."home_presentations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_navigation_fk" FOREIGN KEY ("navigation_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_avatars_fk" FOREIGN KEY ("avatars_id") REFERENCES "public"."avatars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publish_events_fk" FOREIGN KEY ("publish_events_id") REFERENCES "public"."publish_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX "ppv_table_columns_parent_idx" ON "_page_presentations_v_version_sections_table_columns" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_table_rows_cells_order_idx" ON "_page_presentations_v_version_sections_table_rows_cells" USING btree ("_order");
  CREATE INDEX "ppv_table_cells_parent_idx" ON "_page_presentations_v_version_sections_table_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_table_rows_order_idx" ON "_page_presentations_v_version_sections_table_rows" USING btree ("_order");
  CREATE INDEX "_page_presentations_v_version_sections_table_rows_parent_id_idx" ON "_page_presentations_v_version_sections_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_page_presentations_v_version_sections_visual_details_order_idx" ON "_page_presentations_v_version_sections_visual_details" USING btree ("_order");
  CREATE INDEX "ppv_visual_details_parent_idx" ON "_page_presentations_v_version_sections_visual_details" USING btree ("_parent_id");
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
  CREATE INDEX "_page_presentations_v_snapshot_idx" ON "_page_presentations_v" USING btree ("snapshot");
  CREATE INDEX "_page_presentations_v_published_locale_idx" ON "_page_presentations_v" USING btree ("published_locale");
  CREATE INDEX "_page_presentations_v_latest_idx" ON "_page_presentations_v" USING btree ("latest");
  CREATE INDEX "_page_presentations_v_autosave_idx" ON "_page_presentations_v" USING btree ("autosave");
  CREATE INDEX "home_presentations_hero_title_lines_order_idx" ON "home_presentations_hero_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_hero_title_lines_parent_id_idx" ON "home_presentations_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_hero_intro_lines_order_idx" ON "home_presentations_hero_intro_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_hero_intro_lines_parent_id_idx" ON "home_presentations_hero_intro_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_journey_opening_body_lines_order_idx" ON "home_presentations_journey_opening_body_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_journey_opening_body_lines_parent_id_idx" ON "home_presentations_journey_opening_body_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_journey_stages_title_lines_order_idx" ON "home_presentations_journey_stages_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_journey_stages_title_lines_parent_id_idx" ON "home_presentations_journey_stages_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_journey_stages_description_lines_order_idx" ON "home_presentations_journey_stages_description_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_journey_stages_description_lines_parent_id_idx" ON "home_presentations_journey_stages_description_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_journey_stages_document_items_order_idx" ON "home_presentations_journey_stages_document_items" USING btree ("_order");
  CREATE INDEX "home_presentations_journey_stages_document_items_parent_id_idx" ON "home_presentations_journey_stages_document_items" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_journey_stages_order_idx" ON "home_presentations_journey_stages" USING btree ("_order");
  CREATE INDEX "home_presentations_journey_stages_parent_id_idx" ON "home_presentations_journey_stages" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_services_title_lines_order_idx" ON "home_presentations_services_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_services_title_lines_parent_id_idx" ON "home_presentations_services_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_services_items_title_lines_order_idx" ON "home_presentations_services_items_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_services_items_title_lines_parent_id_idx" ON "home_presentations_services_items_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_services_items_order_idx" ON "home_presentations_services_items" USING btree ("_order");
  CREATE INDEX "home_presentations_services_items_parent_id_idx" ON "home_presentations_services_items" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_services_items_image_idx" ON "home_presentations_services_items" USING btree ("image_id");
  CREATE INDEX "home_presentations_assessment_title_lines_order_idx" ON "home_presentations_assessment_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_assessment_title_lines_parent_id_idx" ON "home_presentations_assessment_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_assessment_description_lines_order_idx" ON "home_presentations_assessment_description_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_assessment_description_lines_parent_id_idx" ON "home_presentations_assessment_description_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_faq_heading_lines_order_idx" ON "home_presentations_faq_heading_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_faq_heading_lines_parent_id_idx" ON "home_presentations_faq_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_guides_title_lines_order_idx" ON "home_presentations_guides_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_guides_title_lines_parent_id_idx" ON "home_presentations_guides_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_guides_items_title_lines_order_idx" ON "home_presentations_guides_items_title_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_guides_items_title_lines_parent_id_idx" ON "home_presentations_guides_items_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_guides_items_subtitle_lines_order_idx" ON "home_presentations_guides_items_subtitle_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_guides_items_subtitle_lines_parent_id_idx" ON "home_presentations_guides_items_subtitle_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_guides_items_order_idx" ON "home_presentations_guides_items" USING btree ("_order");
  CREATE INDEX "home_presentations_guides_items_parent_id_idx" ON "home_presentations_guides_items" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_guides_items_image_idx" ON "home_presentations_guides_items" USING btree ("image_id");
  CREATE INDEX "home_presentations_invitation_description_lines_order_idx" ON "home_presentations_invitation_description_lines" USING btree ("_order");
  CREATE INDEX "home_presentations_invitation_description_lines_parent_id_idx" ON "home_presentations_invitation_description_lines" USING btree ("_parent_id");
  CREATE INDEX "home_presentations_invitation_actions_order_idx" ON "home_presentations_invitation_actions" USING btree ("_order");
  CREATE INDEX "home_presentations_invitation_actions_parent_id_idx" ON "home_presentations_invitation_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_presentations_key_idx" ON "home_presentations" USING btree ("key");
  CREATE INDEX "home_presentations_seo_seo_share_image_idx" ON "home_presentations" USING btree ("seo_share_image_id");
  CREATE INDEX "home_presentations_hero_hero_image_idx" ON "home_presentations" USING btree ("hero_image_id");
  CREATE INDEX "home_presentations_updated_at_idx" ON "home_presentations" USING btree ("updated_at");
  CREATE INDEX "home_presentations_created_at_idx" ON "home_presentations" USING btree ("created_at");
  CREATE INDEX "home_presentations_deleted_at_idx" ON "home_presentations" USING btree ("deleted_at");
  CREATE INDEX "home_presentations__status_idx" ON "home_presentations" USING btree ("_status");
  CREATE INDEX "home_presentations_rels_order_idx" ON "home_presentations_rels" USING btree ("order");
  CREATE INDEX "home_presentations_rels_parent_idx" ON "home_presentations_rels" USING btree ("parent_id");
  CREATE INDEX "home_presentations_rels_path_idx" ON "home_presentations_rels" USING btree ("path");
  CREATE INDEX "home_presentations_rels_faqs_id_idx" ON "home_presentations_rels" USING btree ("faqs_id");
  CREATE INDEX "_home_presentations_v_version_hero_title_lines_order_idx" ON "_home_presentations_v_version_hero_title_lines" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_hero_title_lines_parent_id_idx" ON "_home_presentations_v_version_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_hero_intro_lines_order_idx" ON "_home_presentations_v_version_hero_intro_lines" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_hero_intro_lines_parent_id_idx" ON "_home_presentations_v_version_hero_intro_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_journey_opening_body_lines_order_idx" ON "_home_presentations_v_version_journey_opening_body_lines" USING btree ("_order");
  CREATE INDEX "hpv_journey_opening_parent_idx" ON "_home_presentations_v_version_journey_opening_body_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_journey_stages_title_lines_order_idx" ON "_home_presentations_v_version_journey_stages_title_lines" USING btree ("_order");
  CREATE INDEX "hpv_journey_title_parent_idx" ON "_home_presentations_v_version_journey_stages_title_lines" USING btree ("_parent_id");
  CREATE INDEX "hpv_journey_stage_desc_order_idx" ON "_home_presentations_v_version_journey_stages_description_lines" USING btree ("_order");
  CREATE INDEX "hpv_journey_stage_desc_parent_idx" ON "_home_presentations_v_version_journey_stages_description_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_journey_stages_document_items_order_idx" ON "_home_presentations_v_version_journey_stages_document_items" USING btree ("_order");
  CREATE INDEX "hpv_journey_docs_parent_idx" ON "_home_presentations_v_version_journey_stages_document_items" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_journey_stages_order_idx" ON "_home_presentations_v_version_journey_stages" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_journey_stages_parent_id_idx" ON "_home_presentations_v_version_journey_stages" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_services_title_lines_order_idx" ON "_home_presentations_v_version_services_title_lines" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_services_title_lines_parent_id_idx" ON "_home_presentations_v_version_services_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_services_items_title_lines_order_idx" ON "_home_presentations_v_version_services_items_title_lines" USING btree ("_order");
  CREATE INDEX "hpv_service_title_parent_idx" ON "_home_presentations_v_version_services_items_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_services_items_order_idx" ON "_home_presentations_v_version_services_items" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_services_items_parent_id_idx" ON "_home_presentations_v_version_services_items" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_services_items_image_idx" ON "_home_presentations_v_version_services_items" USING btree ("image_id");
  CREATE INDEX "_home_presentations_v_version_assessment_title_lines_order_idx" ON "_home_presentations_v_version_assessment_title_lines" USING btree ("_order");
  CREATE INDEX "hpv_assessment_title_parent_idx" ON "_home_presentations_v_version_assessment_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_assessment_description_lines_order_idx" ON "_home_presentations_v_version_assessment_description_lines" USING btree ("_order");
  CREATE INDEX "hpv_assessment_desc_parent_idx" ON "_home_presentations_v_version_assessment_description_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_faq_heading_lines_order_idx" ON "_home_presentations_v_version_faq_heading_lines" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_faq_heading_lines_parent_id_idx" ON "_home_presentations_v_version_faq_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_guides_title_lines_order_idx" ON "_home_presentations_v_version_guides_title_lines" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_guides_title_lines_parent_id_idx" ON "_home_presentations_v_version_guides_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_guides_items_title_lines_order_idx" ON "_home_presentations_v_version_guides_items_title_lines" USING btree ("_order");
  CREATE INDEX "hpv_guide_title_parent_idx" ON "_home_presentations_v_version_guides_items_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_guides_items_subtitle_lines_order_idx" ON "_home_presentations_v_version_guides_items_subtitle_lines" USING btree ("_order");
  CREATE INDEX "hpv_guide_subtitle_parent_idx" ON "_home_presentations_v_version_guides_items_subtitle_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_guides_items_order_idx" ON "_home_presentations_v_version_guides_items" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_guides_items_parent_id_idx" ON "_home_presentations_v_version_guides_items" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_guides_items_image_idx" ON "_home_presentations_v_version_guides_items" USING btree ("image_id");
  CREATE INDEX "_home_presentations_v_version_invitation_description_lines_order_idx" ON "_home_presentations_v_version_invitation_description_lines" USING btree ("_order");
  CREATE INDEX "hpv_invitation_desc_parent_idx" ON "_home_presentations_v_version_invitation_description_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_version_invitation_actions_order_idx" ON "_home_presentations_v_version_invitation_actions" USING btree ("_order");
  CREATE INDEX "_home_presentations_v_version_invitation_actions_parent_id_idx" ON "_home_presentations_v_version_invitation_actions" USING btree ("_parent_id");
  CREATE INDEX "_home_presentations_v_parent_idx" ON "_home_presentations_v" USING btree ("parent_id");
  CREATE INDEX "_home_presentations_v_version_version_key_idx" ON "_home_presentations_v" USING btree ("version_key");
  CREATE INDEX "_home_presentations_v_version_seo_version_seo_share_imag_idx" ON "_home_presentations_v" USING btree ("version_seo_share_image_id");
  CREATE INDEX "_home_presentations_v_version_hero_version_hero_image_idx" ON "_home_presentations_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_home_presentations_v_version_version_updated_at_idx" ON "_home_presentations_v" USING btree ("version_updated_at");
  CREATE INDEX "_home_presentations_v_version_version_created_at_idx" ON "_home_presentations_v" USING btree ("version_created_at");
  CREATE INDEX "_home_presentations_v_version_version_deleted_at_idx" ON "_home_presentations_v" USING btree ("version_deleted_at");
  CREATE INDEX "_home_presentations_v_version_version__status_idx" ON "_home_presentations_v" USING btree ("version__status");
  CREATE INDEX "_home_presentations_v_created_at_idx" ON "_home_presentations_v" USING btree ("created_at");
  CREATE INDEX "_home_presentations_v_updated_at_idx" ON "_home_presentations_v" USING btree ("updated_at");
  CREATE INDEX "_home_presentations_v_snapshot_idx" ON "_home_presentations_v" USING btree ("snapshot");
  CREATE INDEX "_home_presentations_v_published_locale_idx" ON "_home_presentations_v" USING btree ("published_locale");
  CREATE INDEX "_home_presentations_v_latest_idx" ON "_home_presentations_v" USING btree ("latest");
  CREATE INDEX "_home_presentations_v_autosave_idx" ON "_home_presentations_v" USING btree ("autosave");
  CREATE INDEX "_home_presentations_v_rels_order_idx" ON "_home_presentations_v_rels" USING btree ("order");
  CREATE INDEX "_home_presentations_v_rels_parent_idx" ON "_home_presentations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_presentations_v_rels_path_idx" ON "_home_presentations_v_rels" USING btree ("path");
  CREATE INDEX "_home_presentations_v_rels_faqs_id_idx" ON "_home_presentations_v_rels" USING btree ("faqs_id");
  CREATE INDEX "faqs_contexts_order_idx" ON "faqs_contexts" USING btree ("_order");
  CREATE INDEX "faqs_contexts_parent_id_idx" ON "faqs_contexts" USING btree ("_parent_id");
  CREATE INDEX "faqs_followups_order_idx" ON "faqs_followups" USING btree ("_order");
  CREATE INDEX "faqs_followups_parent_id_idx" ON "faqs_followups" USING btree ("_parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs_deleted_at_idx" ON "faqs" USING btree ("deleted_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE INDEX "_faqs_v_version_contexts_order_idx" ON "_faqs_v_version_contexts" USING btree ("_order");
  CREATE INDEX "_faqs_v_version_contexts_parent_id_idx" ON "_faqs_v_version_contexts" USING btree ("_parent_id");
  CREATE INDEX "_faqs_v_version_followups_order_idx" ON "_faqs_v_version_followups" USING btree ("_order");
  CREATE INDEX "_faqs_v_version_followups_parent_id_idx" ON "_faqs_v_version_followups" USING btree ("_parent_id");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version_deleted_at_idx" ON "_faqs_v" USING btree ("version_deleted_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_snapshot_idx" ON "_faqs_v" USING btree ("snapshot");
  CREATE INDEX "_faqs_v_published_locale_idx" ON "_faqs_v" USING btree ("published_locale");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "_faqs_v_autosave_idx" ON "_faqs_v" USING btree ("autosave");
  CREATE INDEX "navigation_primary_links_order_idx" ON "navigation_primary_links" USING btree ("_order");
  CREATE INDEX "navigation_primary_links_parent_id_idx" ON "navigation_primary_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_key_idx" ON "navigation" USING btree ("key");
  CREATE INDEX "navigation_updated_at_idx" ON "navigation" USING btree ("updated_at");
  CREATE INDEX "navigation_created_at_idx" ON "navigation" USING btree ("created_at");
  CREATE INDEX "navigation_deleted_at_idx" ON "navigation" USING btree ("deleted_at");
  CREATE INDEX "navigation__status_idx" ON "navigation" USING btree ("_status");
  CREATE INDEX "_navigation_v_version_primary_links_order_idx" ON "_navigation_v_version_primary_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_primary_links_parent_id_idx" ON "_navigation_v_version_primary_links" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_footer_columns_links_order_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_links_parent_id_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_footer_columns_order_idx" ON "_navigation_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_parent_id_idx" ON "_navigation_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_parent_idx" ON "_navigation_v" USING btree ("parent_id");
  CREATE INDEX "_navigation_v_version_version_key_idx" ON "_navigation_v" USING btree ("version_key");
  CREATE INDEX "_navigation_v_version_version_updated_at_idx" ON "_navigation_v" USING btree ("version_updated_at");
  CREATE INDEX "_navigation_v_version_version_created_at_idx" ON "_navigation_v" USING btree ("version_created_at");
  CREATE INDEX "_navigation_v_version_version_deleted_at_idx" ON "_navigation_v" USING btree ("version_deleted_at");
  CREATE INDEX "_navigation_v_version_version__status_idx" ON "_navigation_v" USING btree ("version__status");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_snapshot_idx" ON "_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_navigation_v_published_locale_idx" ON "_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_navigation_v_latest_idx" ON "_navigation_v" USING btree ("latest");
  CREATE INDEX "_navigation_v_autosave_idx" ON "_navigation_v" USING btree ("autosave");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_folder_idx" ON "_media_v" USING btree ("version_folder_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_deleted_at_idx" ON "_media_v" USING btree ("version_deleted_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_sizes_thumbnail_version_sizes_thumbnail_idx" ON "_media_v" USING btree ("version_sizes_thumbnail_filename");
  CREATE INDEX "_media_v_version_sizes_card_version_sizes_card_filename_idx" ON "_media_v" USING btree ("version_sizes_card_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "avatars_owner_idx" ON "avatars" USING btree ("owner_id");
  CREATE INDEX "avatars_updated_at_idx" ON "avatars" USING btree ("updated_at");
  CREATE INDEX "avatars_created_at_idx" ON "avatars" USING btree ("created_at");
  CREATE INDEX "avatars_deleted_at_idx" ON "avatars" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "avatars_filename_idx" ON "avatars" USING btree ("filename");
  CREATE INDEX "avatars_sizes_avatar_sizes_avatar_filename_idx" ON "avatars" USING btree ("sizes_avatar_filename");
  CREATE INDEX "publish_events_resource_idx" ON "publish_events" USING btree ("resource");
  CREATE INDEX "publish_events_document_id_idx" ON "publish_events" USING btree ("document_id");
  CREATE UNIQUE INDEX "publish_events_idempotency_key_idx" ON "publish_events" USING btree ("idempotency_key");
  CREATE INDEX "publish_events_triggered_by_idx" ON "publish_events" USING btree ("triggered_by_id");
  CREATE INDEX "publish_events_delivery_status_idx" ON "publish_events" USING btree ("delivery_status");
  CREATE INDEX "publish_events_updated_at_idx" ON "publish_events" USING btree ("updated_at");
  CREATE INDEX "publish_events_created_at_idx" ON "publish_events" USING btree ("created_at");
  CREATE INDEX "audit_logs_changed_by_idx" ON "audit_logs" USING btree ("changed_by_id");
  CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");
  CREATE INDEX "audit_logs_document_id_idx" ON "audit_logs" USING btree ("document_id");
  CREATE INDEX "audit_logs_changed_at_idx" ON "audit_logs" USING btree ("changed_at");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
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
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_page_presentations_id_idx" ON "payload_locked_documents_rels" USING btree ("page_presentations_id");
  CREATE INDEX "payload_locked_documents_rels_home_presentations_id_idx" ON "payload_locked_documents_rels" USING btree ("home_presentations_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_navigation_id_idx" ON "payload_locked_documents_rels" USING btree ("navigation_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_avatars_id_idx" ON "payload_locked_documents_rels" USING btree ("avatars_id");
  CREATE INDEX "payload_locked_documents_rels_publish_events_id_idx" ON "payload_locked_documents_rels" USING btree ("publish_events_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
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
  DROP TABLE "home_presentations_hero_title_lines" CASCADE;
  DROP TABLE "home_presentations_hero_intro_lines" CASCADE;
  DROP TABLE "home_presentations_journey_opening_body_lines" CASCADE;
  DROP TABLE "home_presentations_journey_stages_title_lines" CASCADE;
  DROP TABLE "home_presentations_journey_stages_description_lines" CASCADE;
  DROP TABLE "home_presentations_journey_stages_document_items" CASCADE;
  DROP TABLE "home_presentations_journey_stages" CASCADE;
  DROP TABLE "home_presentations_services_title_lines" CASCADE;
  DROP TABLE "home_presentations_services_items_title_lines" CASCADE;
  DROP TABLE "home_presentations_services_items" CASCADE;
  DROP TABLE "home_presentations_assessment_title_lines" CASCADE;
  DROP TABLE "home_presentations_assessment_description_lines" CASCADE;
  DROP TABLE "home_presentations_faq_heading_lines" CASCADE;
  DROP TABLE "home_presentations_guides_title_lines" CASCADE;
  DROP TABLE "home_presentations_guides_items_title_lines" CASCADE;
  DROP TABLE "home_presentations_guides_items_subtitle_lines" CASCADE;
  DROP TABLE "home_presentations_guides_items" CASCADE;
  DROP TABLE "home_presentations_invitation_description_lines" CASCADE;
  DROP TABLE "home_presentations_invitation_actions" CASCADE;
  DROP TABLE "home_presentations" CASCADE;
  DROP TABLE "home_presentations_rels" CASCADE;
  DROP TABLE "_home_presentations_v_version_hero_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_hero_intro_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_journey_opening_body_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_journey_stages_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_journey_stages_description_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_journey_stages_document_items" CASCADE;
  DROP TABLE "_home_presentations_v_version_journey_stages" CASCADE;
  DROP TABLE "_home_presentations_v_version_services_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_services_items_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_services_items" CASCADE;
  DROP TABLE "_home_presentations_v_version_assessment_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_assessment_description_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_faq_heading_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_guides_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_guides_items_title_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_guides_items_subtitle_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_guides_items" CASCADE;
  DROP TABLE "_home_presentations_v_version_invitation_description_lines" CASCADE;
  DROP TABLE "_home_presentations_v_version_invitation_actions" CASCADE;
  DROP TABLE "_home_presentations_v" CASCADE;
  DROP TABLE "_home_presentations_v_rels" CASCADE;
  DROP TABLE "faqs_contexts" CASCADE;
  DROP TABLE "faqs_followups" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "_faqs_v_version_contexts" CASCADE;
  DROP TABLE "_faqs_v_version_followups" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "navigation_primary_links" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "_navigation_v_version_primary_links" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "avatars" CASCADE;
  DROP TABLE "publish_events" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_page_presentations_status";
  DROP TYPE "public"."enum__page_presentations_v_version_status";
  DROP TYPE "public"."enum__page_presentations_v_published_locale";
  DROP TYPE "public"."enum_home_presentations_journey_stages_key";
  DROP TYPE "public"."enum_home_presentations_services_items_key";
  DROP TYPE "public"."enum_home_presentations_status";
  DROP TYPE "public"."enum__home_presentations_v_version_journey_stages_key";
  DROP TYPE "public"."enum__home_presentations_v_version_services_items_key";
  DROP TYPE "public"."enum__home_presentations_v_version_status";
  DROP TYPE "public"."enum__home_presentations_v_published_locale";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum__faqs_v_published_locale";
  DROP TYPE "public"."enum_navigation_status";
  DROP TYPE "public"."enum__navigation_v_version_status";
  DROP TYPE "public"."enum__navigation_v_published_locale";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_publish_events_action";
  DROP TYPE "public"."enum_publish_events_delivery_status";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_log_parent_task_slug";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";`)
}

