import fs from "node:fs";
import path from "node:path";

const seed = JSON.parse(fs.readFileSync(path.resolve("../../../laifu-cms/seed-data/site-pages.json"), "utf8"));
const routes = ["/", "/services/divorce-coaching/", "/services/high-conflict-divorce/", ...seed.map(page => page.route)];
const pages = new Map();
for (let index = 0; index < routes.length; index += 5) await Promise.all(routes.slice(index, index + 5).map(async route => {
  const response = await fetch(`http://localhost:3001${route}`);
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  const html = await response.text();
  pages.set(route, { ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])), links: [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>/g)].map(match => match[1].replaceAll("&amp;", "&")) });
}));
const failures = [];
let checked = 0;
for (const [route, page] of pages) for (const href of page.links) {
  const url = new URL(href, `http://localhost:3001${route}`);
  if (url.origin !== "http://localhost:3001") continue;
  checked++;
  const target = pages.get(url.pathname);
  if (!target && !fs.existsSync(path.join(process.cwd(), "public", url.pathname))) failures.push({ route, href, reason: "目标页面或文件不存在" });
  else if (target && url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1)))) failures.push({ route, href, reason: "目标章节不存在" });
}
fs.writeFileSync(path.resolve("../../../artifacts/site-links-report.json"), JSON.stringify({ checked, failures }, null, 2));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exitCode = 1; }
else console.log(`全站 ${routes.length} 页、${checked} 个站内链接及跨页章节链接通过。`);
