import { copyFileSync, cpSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.dirname(require.resolve("pdfjs-dist/package.json"));
const output = path.resolve("public/reader");
mkdirSync(output, { recursive: true });
copyFileSync(path.join(root, "build/pdf.worker.min.mjs"), path.join(output, "pdf.worker.min.mjs"));
copyFileSync(path.join(root, "LICENSE"), path.join(output, "LICENSE.pdfjs"));
for (const name of ["cmaps", "standard_fonts", "wasm"]) cpSync(path.join(root, name), path.join(output, name), { recursive: true });
console.log("Reader PDF worker, CMaps, fonts and WASM prepared locally.");
