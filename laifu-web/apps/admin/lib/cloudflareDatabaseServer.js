function getDatabaseApiConfig() {
  const apiUrl = process.env.ASSESSMENT_API_URL?.trim().replace(/\/+$/, "");
  const adminToken = process.env.ASSESSMENT_API_ADMIN_TOKEN?.trim();
  if (!apiUrl || !adminToken) throw new Error("Missing ASSESSMENT_API_URL or ASSESSMENT_API_ADMIN_TOKEN.");
  return { apiUrl, adminToken };
}

export async function cloudflareDatabaseRequest(path, options = {}) {
  const { apiUrl, adminToken } = getDatabaseApiConfig();
  const response = await fetch(`${apiUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error?.message || `Database API request failed with ${response.status}.`);
  return result.data;
}
