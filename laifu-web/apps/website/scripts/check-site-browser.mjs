import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const binary = path.join(process.env.APPDATA, "npm/node_modules/agent-browser/bin/agent-browser-win32-x64.exe");
const seed = JSON.parse(fs.readFileSync(path.resolve("../../../laifu-cms/seed-data/site-pages.json"), "utf8"));
const routes = ["/", "/services/divorce-coaching/", "/services/high-conflict-divorce/", ...seed.map(page => page.route)];
const failures = [];
const report = [];
const browser = (...args) => {
  const output = path.resolve("../../../.service-logs/site-browser-command.out.log");
  const error = path.resolve("../../../.service-logs/site-browser-command.err.log");
  const out = fs.openSync(output, "w");
  const err = fs.openSync(error, "w");
  const result = spawnSync(binary, ["--session", "laifu-site-audit", ...args], { stdio: ["ignore", out, err], timeout: 60000 });
  fs.closeSync(out);
  fs.closeSync(err);
  if (result.error || result.status !== 0) throw new Error(`浏览器命令失败 ${args[0]}: ${fs.readFileSync(error, "utf8")}`);
  return fs.readFileSync(output, "utf8").trim();
};
const evaluate = expression => {
  const result = JSON.parse(browser("eval", expression));
  return typeof result === "string" ? JSON.parse(result) : result;
};
for (const width of [1440, 390, 375, 768]) {
  browser("set", "viewport", String(width), "900");
  for (const route of routes) {
    browser("open", `http://localhost:3001${route}`);
    const result = evaluate(`(() => { const ids=[...document.querySelectorAll('[id]')].map(e=>e.id); return { route:location.pathname,width:innerWidth,pageWidth:document.documentElement.scrollWidth,title:document.querySelector('h1')?.textContent,main:!!document.querySelector('main, #main-content'),brokenImages:[...document.images].filter(i=>i.complete && !i.naturalWidth).map(i=>i.src),duplicateIds:ids.filter((id,index)=>ids.indexOf(id)!==index),missingAnchors:[...document.querySelectorAll('a[href]')].filter(a=>{const u=new URL(a.href);return u.origin===location.origin && u.pathname===location.pathname && u.hash && !document.getElementById(decodeURIComponent(u.hash.slice(1)));}).map(a=>a.getAttribute('href'))}; })()`);
    report.push(result);
    if (!result.main || !result.title || result.pageWidth > width + 1 || result.brokenImages.length || result.duplicateIds.length || result.missingAnchors.length) failures.push(result);
  }
  console.log(`已检查 ${routes.length} 页，视口 ${width}px；累计异常 ${failures.length}`);
}
fs.writeFileSync(path.resolve("../../../artifacts/site-browser-report.json"), JSON.stringify({ checked: report.length, failures, pages: report }, null, 2));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exitCode = 1; }
else console.log(`全站 ${routes.length} 页 × 4 种视口通过：无横向溢出、破图、重复标识或失效页内锚点。`);
browser("close");
