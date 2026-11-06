import type { PageContent, Section } from "@/contracts/page-content";

export function includeResourceArticles(resources: PageContent, articles: PageContent): PageContent {
  const articleSections: Section[] = [
    { id: "articles", title: "文章专栏", blocks: articles.sections.find(section => section.id === "availability")?.blocks ?? [] },
    ...articles.sections.filter(section => ["Q04", "Q07", "Q09", "Q32"].includes(section.id)).map(section => ({ ...section, id: `articles-${section.id.toLowerCase()}` })),
  ];
  const sections = resources.sections.map(section => section.id !== "Q22" ? section : {
    ...section,
    blocks: section.blocks.map(block => block.kind !== "subsection" ? block : {
      ...block,
      blocks: block.blocks.map(child => child.kind !== "subsection" || child.id !== "resources-q23" ? child : {
        ...child,
        title: "（1）文章专栏",
        blocks: [
          { kind: "copy" as const, text: "文章专栏是资源中心的一部分，涵盖情绪与恢复、离婚决策、共同养育及生活重建等议题，可在本页继续浏览栏目导读、文章摘要与精选专题。" },
          { kind: "actions" as const, actions: [{ label: "浏览文章专栏", href: "#resources-articles" }] },
        ],
      }),
    }),
  });
  const insertionIndex = sections.findIndex(section => section.id === "Q22") + 1;
  return { ...resources, sections: [...sections.slice(0, insertionIndex), ...articleSections, ...sections.slice(insertionIndex)] };
}
