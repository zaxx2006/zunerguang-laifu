import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const outputRoot = join(process.cwd(), process.env.LAIFU_PREVIEW_DIR ?? "out");
const sourceRoot = join(process.cwd(), "src");
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
const outputFiles = walk(outputRoot);
const sourceFiles = walk(sourceRoot);
const byExtension = (extension) => outputFiles.filter((file) => extname(file) === extension);
const totalBytes = (files) => files.reduce((total, file) => total + statSync(file).size, 0);
const gzipBytes = (files) => files.length ? gzipSync(Buffer.concat(files.map((file) => readFileSync(file))), { level: 9 }).byteLength : 0;
const jsFiles = byExtension(".js");
const cssFiles = byExtension(".css");
const fontFiles = byExtension(".woff2");
const htmlFiles = byExtension(".html");
const metrics = {
  cssRaw: totalBytes(cssFiles),
  fontRaw: totalBytes(fontFiles),
  htmlLargest: Math.max(...htmlFiles.map((file) => statSync(file).size)),
  htmlLargestGzip: Math.max(...htmlFiles.map((file) => gzipSync(readFileSync(file), { level: 9 }).byteLength)),
  jsGzip: gzipBytes(jsFiles),
  jsRaw: totalBytes(jsFiles),
  outputRaw: totalBytes(outputFiles),
};
const budgets = {
  cssRaw: 196_608,
  fontRaw: 1_048_576,
  htmlLargest: 98_304,
  htmlLargestGzip: 24_576,
  jsGzip: 20_480,
  outputRaw: 10_485_760,
};
const clientBoundaries = sourceFiles.filter((file) => /\.(?:ts|tsx)$/.test(file) && /^\s*["']use client["'];/m.test(readFileSync(file, "utf8")));
const failures = Object.entries(budgets).filter(([key, limit]) => metrics[key] > limit).map(([key, limit]) => `${key}: ${metrics[key]} > ${limit}`);
if (clientBoundaries.length) failures.push(`client boundaries: ${clientBoundaries.map((file) => relative(process.cwd(), file)).join(", ")}`);
if (failures.length) throw new Error(`Performance audit failed\n${failures.join("\n")}`);
console.log(`Performance audit passed: JS ${metrics.jsRaw} B raw / ${metrics.jsGzip} B gzip, CSS ${metrics.cssRaw} B, fonts ${metrics.fontRaw} B, largest HTML ${metrics.htmlLargest} B, output ${metrics.outputRaw} B, zero client boundaries`);
