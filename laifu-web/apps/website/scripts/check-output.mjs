import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, process.env.LAIFU_PREVIEW_DIR ?? "out");
const registry = fs.readFileSync(path.join(root, "src/lib/page-registry.ts"), "utf8");
const slugs = [...registry.matchAll(/\{ slug: "([^"]*)", contentFile:/g)].map((match) => match[1]);
const failures = [];
const decodeAttribute = (value) => value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
const htmlFileForPath = (pathname) => {
  if (pathname === "/") return path.join(outDir, "index.html");
  if (/\.[a-z0-9]+$/i.test(pathname)) return path.join(outDir, pathname.slice(1));
  return path.join(outDir, pathname.replace(/^\//, ""), "index.html");
};
const routeForFile = (file) => {
  const relative = path.relative(outDir, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  return "/" + relative.replace(/index\.html$/, "");
};

for (const slug of slugs) {
  const file = slug ? path.join(outDir, slug, "index.html") : path.join(outDir, "index.html");
  if (!fs.existsSync(file)) failures.push(`缺少静态页面 ${slug || "/"}`);
}
if (!fs.existsSync(path.join(outDir, "404.html"))) failures.push("缺少静态 404.html");
const htmlFiles = [];
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(fullPath);
  }
}
if (fs.existsSync(outDir)) collect(outDir);
for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map((match) => decodeAttribute(match[1]));
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  for (const id of duplicateIds) failures.push(`${path.relative(outDir, file)} 含重复锚点 #${id}`);
  const idSet = new Set(ids);
  for (const match of source.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>/gi)) {
    const href = decodeAttribute(match[1]).trim();
    if (!href) {
      failures.push(`${path.relative(outDir, file)} 含空链接`);
      continue;
    }
    if (/^(?:https?:|mailto:|tel:)/i.test(href)) continue;
    if (/^(?:javascript:|data:)/i.test(href)) {
      failures.push(`${path.relative(outDir, file)} 含不安全链接 ${href}`);
      continue;
    }
    const currentRoute = routeForFile(file);
    const targetUrl = new URL(href, `https://laifu.local${currentRoute}`);
    if (targetUrl.origin !== "https://laifu.local") continue;
    const targetFile = htmlFileForPath(targetUrl.pathname);
    if (!fs.existsSync(targetFile)) {
      failures.push(`${path.relative(outDir, file)} 含失效链接 ${href}`);
      continue;
    }
    if (!targetUrl.hash) continue;
    const fragment = decodeURIComponent(targetUrl.hash.slice(1));
    if (!fragment) {
      failures.push(`${path.relative(outDir, file)} 含空锚点 ${href}`);
      continue;
    }
    const targetIds = targetFile === file ? idSet : new Set([...fs.readFileSync(targetFile, "utf8").matchAll(/\sid="([^"]+)"/g)].map((entry) => decodeAttribute(entry[1])));
    if (!targetIds.has(fragment)) failures.push(`${path.relative(outDir, file)} 含失效锚点 ${href}`);
  }
}
if (failures.length) {
  console.error([...new Set(failures)].join("\n"));
  process.exit(1);
}
console.log(`Output audit passed: ${slugs.length} routes, ${htmlFiles.length} HTML files, all internal links and anchors resolve`);
