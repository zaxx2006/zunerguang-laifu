import fs from "node:fs";
import path from "node:path";

const seed = JSON.parse(fs.readFileSync(path.resolve("../../../laifu-cms/seed-data/site-pages.json"), "utf8"));
const routes = ["/", "/services/divorce-coaching/", "/services/high-conflict-divorce/", ...seed.map(page => page.route)];
const failures = [];
let externalLinks = 0;
let internalLinks = 0;
let assessmentLinks = 0;
for (let index = 0; index < routes.length; index += 5) await Promise.all(routes.slice(index, index + 5).map(async route => {
  const response = await fetch(`http://localhost:3001${route}`);
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  const html = await response.text();
  for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
    const attribute = name => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
    const href = attribute("href")?.replaceAll("&amp;", "&");
    if (!href) continue;
    if (/^(?:\/?#(?:assessment|home-assessment)|\/assessments?\/?(?:[?#].*)?)$/.test(href)) failures.push({ route, href, reason: "测评入口仍指向旧地址" });
    if (href.startsWith("#") || (/^[a-z][a-z\d+.-]*:/i.test(href) && !/^https?:/i.test(href)) || /\sdownload(?:[\s=>])/.test(tag)) continue;
    if (/^(?:https?:)?\/\//i.test(href)) externalLinks++;
    else internalLinks++;
    if (href === "https://laifu-assessments.pages.dev/") assessmentLinks++;
    const rel = attribute("rel")?.split(/\s+/) ?? [];
    if (attribute("target") !== "_blank" || !rel.includes("noopener") || !rel.includes("noreferrer")) failures.push({ route, href, reason: "页面链接未安全地在新标签页打开" });
  }
}));
if (!assessmentLinks) failures.push({ reason: "未找到测评网站入口" });
const report = { pages: routes.length, internalLinks, externalLinks, assessmentLinks, failures };
fs.writeFileSync(path.resolve("../../../artifacts/site-link-policy-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
