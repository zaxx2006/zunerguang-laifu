import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "src/lib/page-registry.ts"), "utf8");
const structured = JSON.parse(fs.readFileSync(path.join(root, "src/content/structured-pages.json"), "utf8"));
const property = (source, name) => {
  const value = source.match(new RegExp(`${name}: "((?:[^"\\\\]|\\\\.)*)"`))?.[1];
  return value === undefined ? undefined : JSON.parse(`"${value}"`);
};
const plain = source => source.replace(/<[^>]+>/g, "").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
function mdxContent(source, title) {
  const sections = [...source.matchAll(/<Section\s+([^>]+)>([\s\S]*?)<\/Section>/g)].map(([, props, body]) => {
    const blocks = [];
    let offset = 0;
    for (const match of body.matchAll(/<(CardGrid|Steps)[^>]*>([\s\S]*?)<\/\1>/g)) {
      const before = plain(body.slice(offset, match.index));
      if (before) blocks.push({ kind: "copy", text: before });
      const items = [...match[2].matchAll(/<article>([\s\S]*?)<\/article>/g)].map(([, article]) => ({ title: article.match(/<h3>(.*?)<\/h3>/)?.[1], blocks: [{ kind: "copy", text: plain(article.replace(/<h3>.*?<\/h3>/, "")) }] }));
      blocks.push({ kind: "grid", mode: match[1] === "Steps" ? "steps" : "cards", items });
      offset = match.index + match[0].length;
    }
    const after = plain(body.slice(offset));
    if (after) blocks.push({ kind: "copy", text: after });
    return { id: props.match(/id="([^"]+)"/)[1], title: props.match(/titleZh="([^"]+)"/)[1], blocks };
  });
  return { sourceSheet: title, intro: [], sections, cta: null };
}
const documents = [];
for (const line of registry.split("\n").filter(line => line.trim().startsWith("{ slug:"))) {
  const slug = property(line, "slug");
  if (!slug || ["services/divorce-coaching", "services/high-conflict-divorce"].includes(slug)) continue;
  const title = property(line, "titleZh");
  const source = fs.readFileSync(path.join(root, "src/content/published", property(line, "contentFile")), "utf8");
  const key = source.match(/<StructuredContent\s+pageKey="([^"]+)"/)?.[1];
  const content = key ? structured[key] : mdxContent(source, title);
  if (!content?.sections.length) throw new Error(`页面缺少正文：${slug}`);
  const image = property(line, "heroImage");
  const metadata = await sharp(path.join(root, "public", image)).metadata();
  documents.push({ internalTitle: title, route: `/${slug}/`, anchorPrefix: key || slug.replaceAll("/", "-"), title, description: property(line, "description"), originalImage: { src: image, alt: property(line, "heroAlt"), width: metadata.width, height: metadata.height }, content, ...(slug === "book-consultation" ? { booking: { phone: "15000973537", wechat: "", questionnaire: "" } } : {}) });
}
const destination = path.resolve(root, "../../../laifu-cms/seed-data/site-pages.json");
fs.writeFileSync(destination, `${JSON.stringify(documents, null, 2)}\n`);
console.log(`已从官网权威内容导出 ${documents.length} 个模板页面：${destination}`);
