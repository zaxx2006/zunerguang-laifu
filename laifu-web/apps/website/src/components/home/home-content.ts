export { homeFooterColumns, arrangeFooterColumns, type FooterColumn } from "../../../../../shared/site-navigation";
import { serviceLinks } from "@/lib/navigation";
import { getPage } from "@/lib/page-registry";

export const homeServices = serviceLinks.map(([href, title]) => {
  const page = getPage(href.slice(1, -1));
  if (!page) throw new Error(`服务页面未注册：${href}`);
  return { href, title, description: page.description.split(/\n\n/)[0].replaceAll("\n", " "), image: { src: page.heroImage, alt: page.heroAlt, width: 1280, height: 854 } };
});

