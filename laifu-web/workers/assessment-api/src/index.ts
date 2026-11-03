interface Env {
  DB: D1Database;
  ADMIN_API_TOKEN: string;
  PUBLIC_ORIGINS?: string;
}

type JsonRecord = Record<string, unknown>;

const ASSESSMENT_TYPES = new Set([
  "divorce_scale",
  "divorce_readiness",
  "spousal_narcissism_risk",
]);
const SERVICE_INTENTS = new Set([
  "legal_support",
  "psychological_support",
  "deep_report",
  "professional_support",
]);
const JSON_FIELDS = new Set([
  "result_payload",
  "weaknesses",
  "dimension_scores",
  "answers",
  "service_type",
]);
const BOOLEAN_FIELDS = new Set([
  "child_gate_answer",
  "cross_border_gate_answer",
]);
const DETAIL_FIELDS = [
  "id",
  "assessment_type",
  "created_at",
  "contact_name",
  "contact_phone",
  "contact_wechat",
  "service_intent",
  "submission_source",
  "total_score",
  "dynamic_full_score",
  "score_rate",
  "result_level",
  "result_label",
  "child_gate_answer",
  "cross_border_gate_answer",
  "weaknesses",
  "dimension_scores",
  "answers",
  "result_payload",
  "follow_up_status",
  "admin_note",
  "service_type",
  "assigned_to",
  "appointment_owner",
  "appointment_time",
  "client_age",
  "client_gender",
  "client_location",
  "asset_tier_level",
  "marital_dispute_summary",
  "last_follow_up_at",
  "updated_by",
  "updated_at",
  "report_visibility",
  "report_version",
  "report_generated_at",
] as const;
const UPDATE_FIELDS = new Set([
  "follow_up_status",
  "service_type",
  "assigned_to",
  "appointment_owner",
  "appointment_time",
  "client_age",
  "client_gender",
  "client_location",
  "asset_tier_level",
  "marital_dispute_summary",
  "admin_note",
  "report_version",
  "last_follow_up_at",
  "updated_at",
  "updated_by",
]);
const MAX_BODY_BYTES = 256 * 1024;
const MAX_EXPORT_ROWS = 1000;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function jsonResponse(payload: unknown, status = 200, headers: HeadersInit = {}): Response {
  return Response.json(payload, { status, headers });
}

function errorResponse(message: string, status = 400, headers: HeadersInit = {}): Response {
  return jsonResponse({ error: { message } }, status, headers);
}

function getAllowedOrigins(env: Env): Set<string> {
  return new Set((env.PUBLIC_ORIGINS ?? "").split(",").map((item) => item.trim()).filter(Boolean));
}

function resolveCorsOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const allowedOrigins = getAllowedOrigins(env);
  if (allowedOrigins.has(origin)) return origin;
  return "";
}

function corsHeaders(request: Request, env: Env): HeadersInit {
  const origin = resolveCorsOrigin(request, env);
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function isAdminAuthorized(request: Request, env: Env): boolean {
  const expected = cleanText(env.ADMIN_API_TOKEN);
  const authorization = request.headers.get("Authorization") ?? "";
  return expected.length >= 32 && authorization === `Bearer ${expected}`;
}

async function readJsonBody(request: Request): Promise<JsonRecord> {
  const contentLength = Number(request.headers.get("Content-Length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) throw new Error("请求内容过大。");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new Error("请求内容过大。");
  const value = JSON.parse(text);
  if (!isRecord(value)) throw new Error("请求格式错误。");
  return value;
}

function requireFiniteNumber(payload: JsonRecord, field: string): number {
  const value = Number(payload[field]);
  if (!Number.isFinite(value)) throw new Error(`${field} 必须是有效数字。`);
  return value;
}

function validateContact(payload: JsonRecord): void {
  const name = cleanText(payload.contact_name);
  const phone = cleanText(payload.contact_phone);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 30) throw new Error("称呼格式不正确。");
  if (phone.length > 32 || digits.length < 7 || digits.length > 15) throw new Error("联系电话格式不正确。");
  if (cleanText(payload.contact_wechat).length > 80) throw new Error("微信号长度超出限制。");
}

function validateSubmission(payload: JsonRecord): void {
  const assessmentType = cleanText(payload.assessment_type);
  const serviceIntent = cleanText(payload.service_intent);
  if (!ASSESSMENT_TYPES.has(assessmentType)) throw new Error("量表类型不正确。");
  if (!SERVICE_INTENTS.has(serviceIntent)) throw new Error("服务意向不正确。");
  requireFiniteNumber(payload, "total_score");
  requireFiniteNumber(payload, "dynamic_full_score");
  requireFiniteNumber(payload, "score_rate");
  if (!cleanText(payload.result_level) || !cleanText(payload.result_label)) throw new Error("测评结果字段不完整。");
  if (!isRecord(payload.dimension_scores) || !isRecord(payload.answers)) throw new Error("答卷结构不正确。");
  validateContact(payload);
}

function encodeJson(value: unknown, fallback: unknown): string {
  return JSON.stringify(value ?? fallback);
}

function toNullableBoolean(value: unknown): number | null {
  if (value === true || value === "true" || value === "yes" || value === 1) return 1;
  if (value === false || value === "false" || value === "no" || value === 0) return 0;
  return null;
}

function parseJsonValue(value: unknown, fallback: unknown): unknown {
  if (typeof value !== "string" || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function decodeRow(row: Record<string, unknown>): JsonRecord {
  const decoded: JsonRecord = { ...row };
  for (const field of JSON_FIELDS) decoded[field] = parseJsonValue(row[field], field === "dimension_scores" || field === "answers" || field === "result_payload" ? {} : []);
  for (const field of BOOLEAN_FIELDS) decoded[field] = row[field] === null || row[field] === undefined ? null : Number(row[field]) === 1;
  return decoded;
}

function normalizeSubmission(payload: JsonRecord): JsonRecord {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    created_at: now,
    assessment_type: cleanText(payload.assessment_type),
    result_payload: encodeJson(payload.result_payload, {}),
    service_intent: cleanText(payload.service_intent),
    total_score: requireFiniteNumber(payload, "total_score"),
    dynamic_full_score: requireFiniteNumber(payload, "dynamic_full_score"),
    score_rate: requireFiniteNumber(payload, "score_rate"),
    result_level: cleanText(payload.result_level),
    result_label: cleanText(payload.result_label),
    child_gate_answer: toNullableBoolean(payload.child_gate_answer),
    cross_border_gate_answer: toNullableBoolean(payload.cross_border_gate_answer),
    weaknesses: encodeJson(payload.weaknesses, []),
    dimension_scores: encodeJson(payload.dimension_scores, {}),
    answers: encodeJson(payload.answers, {}),
    contact_name: cleanText(payload.contact_name),
    contact_phone: cleanText(payload.contact_phone),
    contact_wechat: cleanText(payload.contact_wechat) || null,
    submission_source: cleanText(payload.submission_source) || "web",
    follow_up_status: "new",
    updated_at: now,
    report_visibility: "internal_only",
  };
}

async function createSubmission(request: Request, env: Env): Promise<Response> {
  const headers = corsHeaders(request, env);
  if (resolveCorsOrigin(request, env) === "") return errorResponse("当前来源未被允许。", 403, headers);
  try {
    const payload = await readJsonBody(request);
    validateSubmission(payload);
    const row = normalizeSubmission(payload);
    await env.DB.prepare(`
      INSERT INTO assessment_results (
        id, created_at, assessment_type, result_payload, service_intent,
        total_score, dynamic_full_score, score_rate, result_level, result_label,
        child_gate_answer, cross_border_gate_answer, weaknesses, dimension_scores,
        answers, contact_name, contact_phone, contact_wechat, submission_source,
        follow_up_status, updated_at, report_visibility
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).bind(
      row.id,
      row.created_at,
      row.assessment_type,
      row.result_payload,
      row.service_intent,
      row.total_score,
      row.dynamic_full_score,
      row.score_rate,
      row.result_level,
      row.result_label,
      row.child_gate_answer,
      row.cross_border_gate_answer,
      row.weaknesses,
      row.dimension_scores,
      row.answers,
      row.contact_name,
      row.contact_phone,
      row.contact_wechat,
      row.submission_source,
      row.follow_up_status,
      row.updated_at,
      row.report_visibility
    ).run();
    return jsonResponse({ data: { id: row.id, created_at: row.created_at } }, 201, headers);
  } catch (error) {
    const message = error instanceof Error ? error.message : "提交失败。";
    return errorResponse(message, 400, headers);
  }
}

function addCondition(conditions: string[], params: unknown[], condition: string, ...values: unknown[]): void {
  conditions.push(condition);
  params.push(...values);
}

function escapeLike(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function applyAssessmentCondition(conditions: string[], params: unknown[], assessmentType: string): void {
  if (assessmentType === "spousal_narcissism_risk") addCondition(conditions, params, "assessment_type = ?", assessmentType);
  if (assessmentType === "divorce_readiness") addCondition(conditions, params, "(assessment_type IS NULL OR assessment_type = '' OR assessment_type IN ('divorce_readiness', 'divorce_scale'))");
}

function applyResultLevelCondition(conditions: string[], params: unknown[], resultLevel: string): void {
  const resultMap: Record<string, { assessmentType: string; levels: string[] }> = {
    divorce_high: { assessmentType: "divorce_readiness", levels: ["high"] },
    divorce_mid: { assessmentType: "divorce_readiness", levels: ["medium", "mid"] },
    divorce_low: { assessmentType: "divorce_readiness", levels: ["low"] },
    narcissism_low: { assessmentType: "spousal_narcissism_risk", levels: ["low"] },
    narcissism_mild: { assessmentType: "spousal_narcissism_risk", levels: ["mild"] },
    narcissism_moderate: { assessmentType: "spousal_narcissism_risk", levels: ["moderate"] },
    narcissism_high: { assessmentType: "spousal_narcissism_risk", levels: ["high"] },
  };
  const resolved = resultMap[resultLevel];
  if (!resolved) return;
  applyAssessmentCondition(conditions, params, resolved.assessmentType);
  const placeholders = resolved.levels.map(() => "?").join(", ");
  addCondition(conditions, params, `result_level IN (${placeholders})`, ...resolved.levels);
}

function buildLeadWhere(searchParams: URLSearchParams): { sql: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const resultLevel = cleanText(searchParams.get("resultLevel"));
  const assessmentType = cleanText(searchParams.get("assessmentType"));
  if (resultLevel && resultLevel !== "all") applyResultLevelCondition(conditions, params, resultLevel);
  else if (assessmentType && assessmentType !== "all") applyAssessmentCondition(conditions, params, assessmentType);
  const followUpStatus = cleanText(searchParams.get("followUpStatus"));
  if (followUpStatus && followUpStatus !== "all") addCondition(conditions, params, "follow_up_status = ?", followUpStatus);
  const assignedTo = cleanText(searchParams.get("assignedTo"));
  if (assignedTo) addCondition(conditions, params, "assigned_to LIKE ? ESCAPE '\\'", `%${escapeLike(assignedTo)}%`);
  const serviceIntent = cleanText(searchParams.get("serviceIntent"));
  if (serviceIntent === "none") conditions.push("(service_intent IS NULL OR service_intent = '')");
  else if (serviceIntent && serviceIntent !== "all") addCondition(conditions, params, "service_intent = ?", serviceIntent);
  const serviceType = cleanText(searchParams.get("serviceType"));
  if (serviceType && serviceType !== "all") addCondition(conditions, params, "EXISTS (SELECT 1 FROM json_each(service_type) WHERE json_each.value = ?)", serviceType);
  const createdFrom = cleanText(searchParams.get("createdFrom"));
  if (createdFrom) addCondition(conditions, params, "created_at >= ?", createdFrom);
  const createdTo = cleanText(searchParams.get("createdTo"));
  if (createdTo) addCondition(conditions, params, "created_at <= ?", createdTo);
  const name = cleanText(searchParams.get("name"));
  if (name) addCondition(conditions, params, "contact_name LIKE ? ESCAPE '\\'", `%${escapeLike(name)}%`);
  const phone = cleanText(searchParams.get("phone"));
  if (phone) addCondition(conditions, params, "contact_phone LIKE ? ESCAPE '\\'", `%${escapeLike(phone)}%`);
  return { sql: conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "", params };
}

function safePositiveInteger(value: string | null, fallback: number, maximum: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
}

async function listLeads(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const page = safePositiveInteger(url.searchParams.get("page"), 1, 100000);
  const limit = safePositiveInteger(url.searchParams.get("limit"), 20, MAX_EXPORT_ROWS);
  const offset = (page - 1) * limit;
  const where = buildLeadWhere(url.searchParams);
  const countStatement = env.DB.prepare(`SELECT COUNT(*) AS total FROM assessment_results${where.sql}`).bind(...where.params);
  const rowsStatement = env.DB.prepare(`SELECT ${DETAIL_FIELDS.join(", ")} FROM assessment_results${where.sql} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...where.params, limit, offset);
  const [countResult, rowsResult] = await env.DB.batch<[D1Result<{ total: number }>, D1Result<Record<string, unknown>>]>([countStatement, rowsStatement]);
  const total = Number(countResult.results[0]?.total ?? 0);
  return jsonResponse({ data: { rows: rowsResult.results.map(decodeRow), count: total, page, pageSize: limit } });
}

async function getLead(id: string, env: Env): Promise<Response> {
  const row = await env.DB.prepare(`SELECT ${DETAIL_FIELDS.join(", ")} FROM assessment_results WHERE id = ? LIMIT 1`).bind(id).first<Record<string, unknown>>();
  if (!row) return errorResponse("记录不存在。", 404);
  return jsonResponse({ data: decodeRow(row) });
}

function encodeUpdateValue(field: string, value: unknown): unknown {
  if (JSON_FIELDS.has(field)) return encodeJson(value, []);
  if (field === "client_age") return value === null || value === "" ? null : Number(value);
  return value === "" || value === undefined ? null : value;
}

async function updateLead(id: string, request: Request, env: Env): Promise<Response> {
  const payload = await readJsonBody(request);
  const entries = Object.entries(payload).filter(([field]) => UPDATE_FIELDS.has(field));
  if (entries.length === 0) return errorResponse("没有可更新的字段。");
  const assignments = entries.map(([field]) => `${field} = ?`);
  const values = entries.map(([field, value]) => encodeUpdateValue(field, value));
  await env.DB.prepare(`UPDATE assessment_results SET ${assignments.join(", ")} WHERE id = ?`).bind(...values, id).run();
  return getLead(id, env);
}

async function markReportPreview(id: string, env: Env): Promise<Response> {
  const now = new Date().toISOString();
  const result = await env.DB.prepare("UPDATE assessment_results SET report_generated_at = ?, report_version = COALESCE(NULLIF(report_version, ''), 'v1') WHERE id = ?").bind(now, id).run();
  if (Number(result.meta.changes ?? 0) === 0) return errorResponse("记录不存在。", 404);
  return getLead(id, env);
}

async function deleteLeads(request: Request, env: Env): Promise<Response> {
  const payload = await readJsonBody(request);
  const ids = Array.isArray(payload.ids) ? Array.from(new Set(payload.ids.map(cleanText).filter(Boolean))) : [];
  if (ids.length === 0 || ids.length > 100) return errorResponse("删除记录数量不正确。");
  const placeholders = ids.map(() => "?").join(", ");
  const result = await env.DB.prepare(`DELETE FROM assessment_results WHERE id IN (${placeholders})`).bind(...ids).run();
  return jsonResponse({ data: { deletedCount: Number(result.meta.changes ?? 0) } });
}

async function handleAdmin(request: Request, env: Env, pathname: string): Promise<Response> {
  if (!isAdminAuthorized(request, env)) return errorResponse("Unauthorized", 401);
  if (pathname === "/v1/admin/leads" && request.method === "GET") return listLeads(request, env);
  if (pathname === "/v1/admin/leads" && request.method === "DELETE") return deleteLeads(request, env);
  const reportMatch = pathname.match(/^\/v1\/admin\/leads\/([^/]+)\/report-preview$/);
  if (reportMatch && request.method === "POST") return markReportPreview(decodeURIComponent(reportMatch[1]), env);
  const leadMatch = pathname.match(/^\/v1\/admin\/leads\/([^/]+)$/);
  if (leadMatch && request.method === "GET") return getLead(decodeURIComponent(leadMatch[1]), env);
  if (leadMatch && request.method === "PATCH") return updateLead(decodeURIComponent(leadMatch[1]), request, env);
  return errorResponse("Not found", 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    if (url.pathname === "/health" && request.method === "GET") return jsonResponse({ ok: true, storage: "cloudflare-d1" });
    if (url.pathname === "/v1/submissions" && request.method === "POST") return createSubmission(request, env);
    if (url.pathname.startsWith("/v1/admin/")) {
      try {
        return await handleAdmin(request, env, url.pathname);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Database request failed";
        return errorResponse(message, 500);
      }
    }
    return errorResponse("Not found", 404);
  },
} satisfies ExportedHandler<Env>;
