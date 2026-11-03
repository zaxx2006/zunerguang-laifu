import { z } from "zod";

export const cmsApiVersion = "v1" as const;
export const cmsProjectionVersion = "2026-10-29" as const;

const nonEmpty = z.string().trim().min(1);
const internalOrHttpsHref = nonEmpty.refine(
  (value) => (/^\/(?!\/)/.test(value) || /^#[A-Za-z][\w:-]*$/.test(value) || value.startsWith("https://")),
  "链接必须是站内路径、首页锚点或 HTTPS 地址",
);

export const cmsActionSchema = z.object({
  label: nonEmpty,
  href: internalOrHttpsHref,
  openInNewTab: z.boolean(),
});

export const cmsMediaSchema = z.object({
  src: nonEmpty,
  alt: nonEmpty,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const journeyStageSchema = z.object({
  key: z.enum(["stabilize", "clarify", "decide", "action", "followup"]),
  stepLabel: nonEmpty,
  titleLines: z.array(nonEmpty).min(1).max(2),
  descriptionLines: z.array(nonEmpty).min(1).max(2),
  documentLabel: z.string(),
  documentItems: z.array(z.object({ marker: nonEmpty, text: nonEmpty, note: nonEmpty })).max(3),
});

const serviceSchema = z.object({
  key: z.enum(["coaching", "highConflict", "courses", "community", "academy"]),
  titleLines: z.array(nonEmpty).min(1).max(2),
  description: nonEmpty,
  actionLabel: nonEmpty,
  href: internalOrHttpsHref,
  image: cmsMediaSchema,
});

const faqSchema = z.object({
  id: z.string().min(1),
  question: nonEmpty,
  lead: nonEmpty,
  answer: nonEmpty,
  contexts: z.array(z.object({
    label: nonEmpty,
    copy: nonEmpty,
    action: cmsActionSchema.nullable(),
  })).min(1).max(3),
  followups: z.array(z.object({ question: nonEmpty, answer: nonEmpty })).min(1).max(3),
});

const guideSchema = z.object({
  eyebrow: nonEmpty,
  titleLines: z.array(nonEmpty).min(1).max(2),
  subtitleLines: z.array(nonEmpty).min(1).max(2),
  image: cmsMediaSchema,
  meta: nonEmpty,
  href: internalOrHttpsHref,
});

export const homePresentationSchema = z.object({
  seo: z.object({ title: nonEmpty, description: nonEmpty, shareImage: cmsMediaSchema }),
  hero: z.object({
    titleLines: z.array(nonEmpty).length(2),
    introLines: z.array(nonEmpty).min(1).max(2),
    image: cmsMediaSchema,
    searchPlaceholder: nonEmpty,
    primaryAction: cmsActionSchema,
    secondaryAction: cmsActionSchema,
    journeyLinkLabel: nonEmpty,
    journeySummary: nonEmpty,
  }),
  journey: z.object({
    openingTitle: nonEmpty,
    openingBodyLines: z.array(nonEmpty).min(1).max(2),
    stages: z.array(journeyStageSchema).length(5),
    caption: nonEmpty,
  }),
  services: z.object({
    titleLines: z.array(nonEmpty).length(2),
    items: z.array(serviceSchema).length(5),
    captionLeft: nonEmpty,
    captionRight: nonEmpty,
  }),
  assessment: z.object({
    titleLines: z.array(nonEmpty).length(2),
    descriptionLines: z.array(nonEmpty).min(1).max(2),
    action: cmsActionSchema,
    note: nonEmpty,
  }),
  faqs: z.array(faqSchema).length(5),
  faqHeadingLines: z.array(nonEmpty).length(2),
  faqIndexAction: cmsActionSchema,
  faqContactAction: cmsActionSchema,
  guides: z.object({
    titleLines: z.array(nonEmpty).length(2),
    description: nonEmpty,
    items: z.array(guideSchema).max(3),
    statusNote: nonEmpty,
    indexAction: cmsActionSchema,
  }),
  invitation: z.object({
    title: nonEmpty,
    descriptionLines: z.array(nonEmpty).min(1).max(2),
    actions: z.array(cmsActionSchema).length(3),
    assessmentNote: nonEmpty,
  }),
});

export const navigationPresentationSchema = z.object({
  homeHref: internalOrHttpsHref,
  primaryLinks: z.array(cmsActionSchema).min(1).max(6),
  assessmentAction: cmsActionSchema,
  footerColumns: z.array(z.object({
    title: nonEmpty,
    links: z.array(cmsActionSchema).min(1).max(6),
  })).min(4).max(6),
  footerStatement: nonEmpty,
  footerDisclaimer: nonEmpty,
  copyright: nonEmpty,
});

function envelopeSchema<T extends z.ZodType>(presentation: T) {
  return z.object({
    apiVersion: z.literal(cmsApiVersion),
    projectionVersion: z.literal(cmsProjectionVersion),
    contentVersion: nonEmpty,
    data: z.object({ presentation }),
  });
}

export const homeEnvelopeSchema = envelopeSchema(homePresentationSchema);
export const navigationEnvelopeSchema = envelopeSchema(navigationPresentationSchema);

export type CmsAction = z.infer<typeof cmsActionSchema>;
export type CmsMedia = z.infer<typeof cmsMediaSchema>;
export type HomePresentation = z.infer<typeof homePresentationSchema>;
export type NavigationPresentation = z.infer<typeof navigationPresentationSchema>;
export type HomeEnvelope = z.infer<typeof homeEnvelopeSchema>;
export type NavigationEnvelope = z.infer<typeof navigationEnvelopeSchema>;

export function createCmsEnvelope<T>(contentVersion: string, presentation: T) {
  return { apiVersion: cmsApiVersion, projectionVersion: cmsProjectionVersion, contentVersion, data: { presentation } };
}
