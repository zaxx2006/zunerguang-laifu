import { z } from "zod";

const pageStatusSchema = z.enum(["published", "prelaunch"]);
const pageLayoutSchema = z.enum(["landing", "service", "editorial", "faq", "booking"]);
const pageGroupSchema = z.enum(["company", "service", "program", "learn", "professional"]);

export const pageMetaSchema = z.object({
  slug: z.string(),
  parentSlug: z.string().optional(),
  contentFile: z.string().endsWith(".mdx"),
  titleEn: z.string().min(1),
  titleZh: z.string().min(1),
  eyebrow: z.string(),
  description: z.string().min(20),
  seoTitle: z.string().min(1).optional(),
  seoDescription: z.string().min(20).optional(),
  keywords: z.array(z.string().min(1)).optional(),
  heroImage: z.string().startsWith("/"),
  heroAlt: z.string().min(1),
  status: pageStatusSchema,
  layout: pageLayoutSchema,
  group: pageGroupSchema,
});

export type PageMeta = z.infer<typeof pageMetaSchema>;
