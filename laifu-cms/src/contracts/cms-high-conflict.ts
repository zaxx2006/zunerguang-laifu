import { z } from "zod";
import { cmsActionSchema, cmsMediaSchema } from "./cms-home";

const text = z.string().trim().min(1).max(1200);
const list = (min = 1, max = 8) => z.array(text).min(min).max(max);
export const priorityKeys = ["safety", "rest", "children", "contact", "materials", "housing", "legal", "network"] as const;
const priorityKey = z.enum(priorityKeys);
const uniqueKeys = (items: { key: string }[]) => new Set(items.map(item => item.key)).size === items.length;

export const highConflictPresentationSchema = z.object({
  key: z.literal("high-conflict-divorce"),
  hero: z.object({ title: text, statement: text, audience: text, value: text, image: cmsMediaSchema, caption: text, primaryAction: cmsActionSchema, secondaryAction: cmsActionSchema }),
  situations: z.object({ title: text, intro: text, note: text, empty: text, resultLabel: text, items: z.array(z.object({ key: text, label: text, priority: priorityKey })).min(7).max(10).refine(uniqueKeys, "情境标识不可重复") }),
  cycle: z.object({ title: text, intro: text, note: text, steps: z.array(z.object({ title: text, description: text, response: text })).length(6) }),
  support: z.object({ title: text, intro: text, directions: z.array(z.object({ key: text, label: text, title: text, situation: text, goal: text, work: list(3, 3), toolTitle: text, toolRows: z.array(z.object({ label: text, text })).length(3), note: text })).min(4).max(7).refine(uniqueKeys, "支持方向标识不可重复") }),
  priorities: z.object({ title: text, intro: text, privacy: text, empty: text, summaryTitle: text, summaryIntro: text, copyLabel: text, copiedLabel: text, copyFailed: text, clearLabel: text, items: z.array(z.object({ key: priorityKey, label: text, guidance: text, prompt: text })).length(8).refine(uniqueKeys, "优先事项标识不可重复") }),
  process: z.object({ title: text, intro: text, steps: z.array(z.object({ title: text, discussion: text, result: text, next: text })).length(4) }),
  children: z.object({ title: text, intro: text, image: cmsMediaSchema, caption: text, items: list(5, 5), note: text }),
  comparison: z.object({ title: text, intro: text, caption: text, headers: list(5, 5), rows: z.array(z.object({ dimension: text, coaching: text, therapy: text, legal: text, urgent: text })).length(5) }),
  outcomes: z.object({ title: text, intro: text, items: list(6, 6) }),
  boundaries: z.object({ title: text, items: list(4, 6), urgent: text }),
  finalCta: z.object({ title: text, description: text, actions: z.array(cmsActionSchema).length(3) }),
  ui: z.object({ navLabel: text, navigation: z.array(z.object({ label: text, section: z.enum(["situations", "cycle", "support", "priorities", "process", "children", "professionals", "boundaries"]) })).min(4).max(8), situationLabel: text, goalLabel: text, workLabel: text, discussionLabel: text, resultLabel: text, nextLabel: text, selectedLabel: text, emergencyLabel: text, previewLabel: text, exitPreview: text }),
});

export type HighConflictPresentation = z.infer<typeof highConflictPresentationSchema>;
