import { z } from "zod";
import rawPlans from "@/content/section-design.json";
import structuredPages from "@/content/structured-pages.json";
import type { SectionLayout } from "@/components/content/content-types";

const mediaAssetSchema = z.enum(["walk", "reflection", "room", "path", "journal", "aboutWindow", "aboutHome", "collaborationCafe", "resourceNotes", "articleReading", "mediaRecording", "mediaReflection", "remarriageRings", "servicesRoad", "servicesOffice"]);
const mediaPlacementSchema = z.enum(["portrait", "banner", "rail"]);
const sectionRoleSchema = z.enum(["story", "feature", "principles", "cards", "steps", "faq", "tool", "comparison", "metrics", "directory", "notice", "media", "testimonials"]);
const sectionToneSchema = z.enum(["canvas", "sand", "stone"]);
const sectionDensitySchema = z.enum(["compact", "regular", "feature"]);
const visualDecisionSchema = z.enum(["none", "photo", "illustration"]);
const sectionColumnsSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).refine((value) => 12 % value === 0);
const proseColumnsSchema = z.literal(3);
const sectionMediaSchema = z.object({ asset: mediaAssetSchema, placement: mediaPlacementSchema, alt: z.string().min(4), focal: z.literal("subject").optional() });
const illustrationRoles = new Set(["tool", "faq", "directory", "notice"]);
const sectionUnitSchema = z.object({ id: z.string().min(1), sourceIds: z.array(z.string().min(1)).min(1), title: z.string().min(1).optional(), role: sectionRoleSchema, columns: sectionColumnsSchema, proseColumns: proseColumnsSchema.optional(), tone: sectionToneSchema, density: sectionDensitySchema, visualDecision: visualDecisionSchema, media: sectionMediaSchema.optional(), illustration: z.string().endsWith(".svg").optional(), mediaRationale: z.string().min(12).optional() }).superRefine((section, context) => {
  const expectedDecision = section.media ? "photo" : section.illustration ? "illustration" : "none";
  if (section.visualDecision !== expectedDecision) context.addIssue({ code: "custom", message: "视觉判断与实际图片类型不一致" });
  if (expectedDecision === "none" ? section.mediaRationale : !section.mediaRationale) context.addIssue({ code: "custom", message: "只有实际使用图片时才能且必须记录理由" });
  if (section.illustration && !illustrationRoles.has(section.role)) context.addIssue({ code: "custom", message: "插图只允许用于抽象工具、问答、目录或提示" });
});
const pageSectionPlanSchema = z.object({ sourceSectionCount: z.number().int().positive(), sectionCount: z.number().int().positive(), introProseColumns: proseColumnsSchema.optional(), sections: z.array(sectionUnitSchema).min(1) });
const sectionPlansSchema = z.record(z.string(), pageSectionPlanSchema);
const mediaAssets = {
  walk: { file: "hero-walk.webp", width: 1600, height: 1067 },
  reflection: { file: "self-reflection.webp", width: 1600, height: 1067 },
  room: { file: "sunlit-room.webp", width: 1600, height: 1061 },
  path: { file: "forest-path.webp", width: 1600, height: 1067 },
  journal: { file: "journal.webp", width: 1600, height: 1067 },
  aboutWindow: { file: "section-about-window.webp", width: 1600, height: 1067 },
  aboutHome: { file: "section-about-home.webp", width: 1600, height: 1067 },
  collaborationCafe: { file: "section-collaboration-cafe.webp", width: 1600, height: 1068 },
  resourceNotes: { file: "section-resources-notes.webp", width: 1600, height: 1067 },
  articleReading: { file: "section-articles-reading.webp", width: 1600, height: 1067 },
  mediaRecording: { file: "section-media-recording.webp", width: 1600, height: 1060 },
  mediaReflection: { file: "section-media-reflection.webp", width: 1600, height: 1068 },
  remarriageRings: { file: "section-remarriage-rings.webp", width: 1600, height: 1067 },
  servicesRoad: { file: "section-services-shanghai-road.webp", width: 1600, height: 1199 },
  servicesOffice: { file: "section-services-office.webp", width: 1600, height: 1067 },
} as const;

export type PageKey = keyof typeof structuredPages;
export type SectionRole = z.infer<typeof sectionRoleSchema>;
export type SectionTone = z.infer<typeof sectionToneSchema>;
export type SectionDensity = z.infer<typeof sectionDensitySchema>;
export type SectionColumns = z.infer<typeof sectionColumnsSchema>;
export type SectionUnitDesign = z.infer<typeof sectionUnitSchema>;
export type SectionMedia = { src: string; alt: string; width: number; height: number; placement: "portrait" | "banner" | "rail"; focal?: "subject" };

function validatePlans() {
  const plans = sectionPlansSchema.parse(rawPlans);
  const pageKeys = Object.keys(structuredPages);
  if (Object.keys(plans).join("|") !== pageKeys.join("|")) throw new Error("章节设计清单与内容页面顺序不一致");
  for (const pageKey of pageKeys as PageKey[]) {
    const page = structuredPages[pageKey];
    const plan = plans[pageKey];
    const sourceIds = page.sections.map((section) => section.id);
    const coveredIds = plan.sections.flatMap((section) => section.sourceIds);
    if (plan.sourceSectionCount !== sourceIds.length) throw new Error(`${pageKey} 的来源章节数量不一致`);
    if (plan.sectionCount !== plan.sections.length) throw new Error(`${pageKey} 的设计章节数量不一致`);
    if (coveredIds.join("|") !== sourceIds.join("|")) throw new Error(`${pageKey} 的章节归类存在遗漏、重复或顺序错误`);
    if (new Set(plan.sections.map((section) => section.id)).size !== plan.sections.length) throw new Error(`${pageKey} 的设计章节 ID 重复`);
  }
  return plans as Record<PageKey, z.infer<typeof pageSectionPlanSchema>>;
}

export const sectionPlans = validatePlans();

export function getPageSectionPlan(pageKey: PageKey) {
  return sectionPlans[pageKey];
}

export function resolveSectionMedia(media?: SectionUnitDesign["media"]): SectionMedia | undefined {
  if (!media) return undefined;
  const asset = mediaAssets[media.asset];
  return { src: `/images/editorial/${asset.file}`, alt: media.alt, width: asset.width, height: asset.height, placement: media.placement, focal: media.focal };
}

export function sectionLayoutForRole(role: SectionRole): SectionLayout {
  if (role === "notice") return "notice";
  if (role === "story") return "reading";
  if (role === "feature") return "feature";
  if (role === "media") return "spread";
  return "collection";
}
