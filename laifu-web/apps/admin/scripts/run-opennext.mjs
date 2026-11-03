import { existsSync, renameSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localEnv = path.join(appDir, ".env.local");
const parkedEnv = path.join(appDir, ".env.local.opennext");
const hasLocalEnv = existsSync(localEnv);

if (existsSync(parkedEnv)) {
  throw new Error(`Temporary environment file already exists: ${parkedEnv}`);
}
if (hasLocalEnv) {
  renameSync(localEnv, parkedEnv);
}
let result;
try {
  result = spawnSync("opennextjs-cloudflare", process.argv.slice(2), {
    cwd: appDir,
    env: process.env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
} finally {
  if (hasLocalEnv) {
    renameSync(parkedEnv, localEnv);
  }
}
if (result.error) {
  throw result.error;
}
process.exitCode = result.status ?? 1;
