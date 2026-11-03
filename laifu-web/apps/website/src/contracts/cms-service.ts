import { z } from "zod";
import { highConflictPresentationSchema } from "./cms-high-conflict";
import { cmsActionSchema, cmsMediaSchema } from "./cms-home";

export const serviceCmsProjectionVersion = "2026-10-22" as const;
export const servicePresentationKeySchema = z.enum(["divorce-coaching", "high-conflict-divorce"]);
const nonEmpty = z.string().trim().min(1);
const lines = (minimum: number, maximum: number) => z.array(nonEmpty).min(minimum).max(maximum);
const keyedCopy = z.object({ key: nonEmpty, label: nonEmpty, text: nonEmpty });

export const divorceCoachingPresentationSchema = z.object({
  key: z.literal("divorce-coaching"),
  hero: z.object({ statementLines: lines(2, 3), audience: nonEmpty, context: nonEmpty, image: cmsMediaSchema, caption: nonEmpty, primaryAction: cmsActionSchema, secondaryAction: cmsActionSchema }),
  fit: z.object({
    title: nonEmpty,
    introLines: lines(1, 2),
    overview: lines(1, 10),
    note: nonEmpty,
    stages: z.array(z.object({ key: nonEmpty, label: nonEmpty, title: nonEmpty, description: nonEmpty, concerns: lines(1, 4), support: nonEmpty, supportDirection: z.enum(["emotional", "preparation", "rebuilding"]) })).length(4),
  }),
  why: z.object({ title: nonEmpty, statement: nonEmpty, paragraphs: lines(1, 5) }),
  support: z.object({
    title: nonEmpty,
    introLines: lines(1, 2),
    directions: z.array(z.object({ key: z.enum(["emotional", "preparation", "rebuilding"]), label: nonEmpty, title: nonEmpty, description: nonEmpty, image: cmsMediaSchema, caption: nonEmpty, topics: z.array(z.object({ key: nonEmpty, title: nonEmpty, body: nonEmpty })).min(1).max(3) })).length(3),
    reflections: z.array(keyedCopy.extend({ title: nonEmpty })).length(4),
    documents: z.array(z.object({ key: nonEmpty, title: nonEmpty, rows: z.array(z.object({ label: nonEmpty, text: nonEmpty })).length(3) })).length(3),
    lifeAreas: z.array(keyedCopy).length(4),
  }),
  process: z.object({
    title: nonEmpty,
    intro: nonEmpty,
    steps: z.array(z.object({ key: nonEmpty, label: nonEmpty, short: nonEmpty, intro: nonEmpty, focus: lines(1, 4), goal: nonEmpty, mapTitle: nonEmpty, mapItems: lines(3, 3), mapEnd: nonEmpty })).length(3),
    modulesTitle: nonEmpty,
    modules: z.array(z.object({ title: nonEmpty, text: nonEmpty })).min(1).max(6),
    note: nonEmpty,
  }),
  options: z.object({ title: nonEmpty, intro: nonEmpty, choices: lines(1, 8), closingLines: lines(1, 3), action: cmsActionSchema }),
  comparison: z.object({ title: nonEmpty, intro: nonEmpty, caption: nonEmpty, headers: lines(4, 4), rows: z.array(z.object({ dimension: nonEmpty, therapy: nonEmpty, coaching: nonEmpty, legal: nonEmpty })).min(1).max(8) }),
  outcomes: z.object({ title: nonEmpty, intro: nonEmpty, items: lines(1, 10), closing: nonEmpty }),
  boundaries: z.object({ title: nonEmpty, intro: nonEmpty, items: z.array(z.object({ title: nonEmpty, body: nonEmpty })).length(3), closing: nonEmpty }),
  finalCta: z.object({ title: nonEmpty, descriptionLines: lines(1, 2), actions: z.array(cmsActionSchema).length(3), assessmentNote: nonEmpty }),
});

export const servicePresentationSchema = z.discriminatedUnion("key", [divorceCoachingPresentationSchema, highConflictPresentationSchema]);

export const serviceEnvelopeSchema = z.object({
  apiVersion: z.literal("v1"),
  projectionVersion: z.literal(serviceCmsProjectionVersion),
  contentVersion: nonEmpty,
  data: z.object({ presentation: servicePresentationSchema }),
});

export type ServicePresentation = z.infer<typeof divorceCoachingPresentationSchema>;
export type AnyServicePresentation = z.infer<typeof servicePresentationSchema>;
