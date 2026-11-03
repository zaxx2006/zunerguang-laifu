const requiredNames = ["DATABASE_URI", "PAYLOAD_SECRET"] as const;

export type RequiredEnvironmentName = typeof requiredNames[number];

export function requiredEnvironment(name: RequiredEnvironmentName): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export function cmsServerURL(): string {
  return process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158";
}

export function browserOrigins(): string[] {
  const origins = new Set<string>();
  for (const value of [process.env.LAIFU_WEB_URL, process.env.PAYLOAD_PUBLIC_SERVER_URL]) {
    if (!value) continue;
    const url = new URL(value);
    origins.add(url.origin);
    if (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)) {
      url.hostname = url.hostname === "localhost" ? "127.0.0.1" : "localhost";
      origins.add(url.origin);
    }
  }
  return [...origins];
}
