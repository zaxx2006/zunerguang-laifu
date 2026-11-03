import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/content/MdxComponents";
import { StructuredContent } from "@/components/content/StructuredContent";
import structuredPages from "@/content/structured-pages.json";
import type { Block } from "@/components/content/content-types";
import type { PageKey } from "@/lib/section-design";
import type { PageMeta } from "@/lib/page-schema";

function StructuredPageBody({ pageKey }: { pageKey: PageKey }) {
  return <StructuredContent pageKey={pageKey} includeIntro={false} />;
}

const pageBodyComponents = { ...mdxComponents, StructuredContent: StructuredPageBody };

export const loadPageContent = cache(async (page: PageMeta) => {
  const filePath = path.join(process.cwd(), "src/content/published", page.contentFile);
  const source = await fs.readFile(filePath, "utf8");
  const pageKey = source.match(/<StructuredContent\s+pageKey="([^"]+)"/u)?.[1];
  const intro = page.slug && pageKey && pageKey in structuredPages ? structuredPages[pageKey as PageKey].intro as Block[] : [];
  const result = await compileMDX({ source, components: page.slug ? pageBodyComponents : mdxComponents, options: { parseFrontmatter: false } });
  return { content: result.content, intro };
});
