import { ChevronRight } from "lucide-react";
import { getPage, getPublicPath } from "@/lib/page-registry";
import { SiteLink } from "./SiteLink";
import "./breadcrumbs.css";

const labels: Record<string, string> = {
  services: "服务体系",
  academy: "焕屿学院",
  faq: "常见问题",
  "about/founder": "创始人简介",
};

export function Breadcrumbs({ slug }: { slug: string }) {
  const page = getPage(slug);
  if (!page || !slug) return null;
  const ancestors = [];
  let parentSlug = page.parentSlug ?? slug.split("/").slice(0, -1).join("/");
  while (parentSlug) {
    const parent = getPage(parentSlug);
    if (parent) ancestors.unshift(parent);
    parentSlug = parent?.parentSlug ?? parentSlug.split("/").slice(0, -1).join("/");
  }
  return <nav className="site-breadcrumbs" aria-label="面包屑导航"><ol>
    <li><SiteLink href="/">首页</SiteLink></li>
    {ancestors.map(parent => <li key={parent.slug}><ChevronRight aria-hidden="true" /><SiteLink href={getPublicPath(parent)}>{labels[parent.slug] ?? parent.titleZh}</SiteLink></li>)}
    <li><ChevronRight aria-hidden="true" /><span aria-current="page" title={labels[slug] ?? page.titleZh}>{labels[slug] ?? page.titleZh}</span></li>
  </ol></nav>;
}
