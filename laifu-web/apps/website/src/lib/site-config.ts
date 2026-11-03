import { z } from "zod";
import { assessmentUrl } from "./site-links";

const siteUrlValue = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const siteConfigSchema = z.object({
  nameZh: z.string(),
  nameEn: z.string(),
  siteUrl: z.url().optional(),
  booking: z.object({
    mode: z.literal("form"),
    href: z.literal("/book-consultation/"),
  }),
  assessment: z.object({
    href: z.url(),
  }),
});

export const siteConfig = siteConfigSchema.parse({
  nameZh: "焕屿困境辅导",
  nameEn: "LAIFU",
  siteUrl: siteUrlValue || undefined,
  booking: {
    mode: "form",
    href: "/book-consultation/",
  },
  assessment: {
    href: assessmentUrl,
  },
});
