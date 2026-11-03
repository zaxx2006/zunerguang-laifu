import type { PageMeta } from "@/lib/page-schema";

export type HeroComposition = "cover" | "story" | "service" | "index" | "utility" | "experience" | "essay";

export function heroCompositionFor(page: PageMeta): HeroComposition {
  if (!page.slug) return "cover";
  if (page.slug === "about") return "story";
  if (page.slug === "about/founder" || page.slug.startsWith("blog/topics/")) return "essay";
  if (["resources", "faq", "book-consultation", "blog"].includes(page.slug) || page.titleZh === "服务入口已更新") return "utility";
  if (page.group === "program") return "experience";
  if (["services", "academy", "media"].includes(page.slug)) return "index";
  return "service";
}
