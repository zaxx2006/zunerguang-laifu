import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const outputRoot = join(process.cwd(), process.env.LAIFU_PREVIEW_DIR ?? "out");
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
const htmlFiles = walk(outputRoot).filter((file) => extname(file) === ".html");
for (const file of htmlFiles) {
  const source = readFileSync(file, "utf8");
  const withoutRuntime = source.replace(/<link(?=[^>]*rel="preload")(?=[^>]*as="script")[^>]*\/?>/g, "").replace(/<script(?![^>]*type="application\/ld\+json")(?![^>]*data-home-preview="true")[^>]*>[\s\S]*?<\/script>/g, "");
  const withHomeScripts = source.includes('data-page="home"') && !withoutRuntime.includes('/home-preview/home.js')
    ? withoutRuntime.replace("</body>", '<script data-home-preview="true" src="/home-preview/page-flip.browser.js" defer></script><script data-home-preview="true" src="/home-preview/home.js" defer></script></body>')
    : withoutRuntime;
  writeFileSync(file, withHomeScripts);
}
const runtimeFiles = walk(outputRoot).filter((file) => extname(file) === ".js" && file.includes(`${join("_next", "static")}`) || extname(file) === ".txt" && (basename(file).startsWith("__next.") || basename(file) === "index.txt"));
runtimeFiles.forEach((file) => unlinkSync(file));
console.log(`Static runtime stripped: ${htmlFiles.length} HTML files, ${runtimeFiles.length} unused JS/RSC files removed`);
