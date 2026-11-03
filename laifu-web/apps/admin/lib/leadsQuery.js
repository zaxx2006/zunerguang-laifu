import {
  normalizeAssessmentTypeFilterValue,
  normalizeResultLevelFilterValue,
} from "./leadAssessment";
import { cloudflareDatabaseRequest } from "./cloudflareDatabaseServer";

const LEADS_PAGE_SIZE = 20;
export const LEADS_EXPORT_LIMIT = 1000;

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getSafeFilter(raw, fallback = "") {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function normalizeDateFilter(value) {
  if (!hasText(value)) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

export function normalizeLeadFilters(raw = {}) {
  const assessmentType = normalizeAssessmentTypeFilterValue(
    getSafeFilter(raw.assessmentType, "all") || "all"
  );

  const filters = {
    name: getSafeFilter(raw.name),
    phone: getSafeFilter(raw.phone),
    assessmentType,
    followUpStatus: getSafeFilter(raw.followUpStatus, "all") || "all",
    resultLevel: normalizeResultLevelFilterValue(
      getSafeFilter(raw.resultLevel, "all") || "all",
      assessmentType
    ),
    assignedTo: getSafeFilter(raw.assignedTo),
    serviceIntent: getSafeFilter(raw.serviceIntent, "all") || "all",
    serviceType: getSafeFilter(raw.serviceType, "all") || "all",
    createdFrom: getSafeFilter(raw.createdFrom),
    createdTo: getSafeFilter(raw.createdTo),
  };

  return filters;
}

export function normalizeLeadPage(rawPage) {
  const raw = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return page;
}

export function buildLeadsSearchParams(filters, options = {}) {
  const { page, includePage = true } = options;
  const params = new URLSearchParams();

  const entries = [
    ["name", filters.name],
    ["phone", filters.phone],
    ["assessmentType", filters.assessmentType],
    ["followUpStatus", filters.followUpStatus],
    ["resultLevel", filters.resultLevel],
    ["assignedTo", filters.assignedTo],
    ["serviceIntent", filters.serviceIntent],
    ["serviceType", filters.serviceType],
    ["createdFrom", filters.createdFrom],
    ["createdTo", filters.createdTo],
  ];

  for (const [key, value] of entries) {
    if (!hasText(value)) continue;
    if (value === "all") continue;
    params.set(key, value);
  }

  if (includePage && page && page > 1) {
    params.set("page", String(page));
  }

  return params;
}

function buildDatabaseSearchParams(filters, options = {}) {
  const params = buildLeadsSearchParams(filters, { includePage: false });
  const createdFrom = normalizeDateFilter(filters.createdFrom);
  const createdTo = normalizeDateFilter(filters.createdTo);
  if (createdFrom) params.set("createdFrom", createdFrom);
  else params.delete("createdFrom");
  if (createdTo) params.set("createdTo", createdTo);
  else params.delete("createdTo");
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  return params;
}

export async function queryLeads(filters, options = {}) {
  const page = normalizeLeadPage(options.page);
  const pageSize = options.pageSize ?? LEADS_PAGE_SIZE;
  try {
    const params = buildDatabaseSearchParams(filters, { page, limit: pageSize });
    const data = await cloudflareDatabaseRequest(`/v1/admin/leads?${params}`);
    return { rows: data.rows ?? [], count: data.count ?? 0, page, pageSize, error: null };
  } catch (error) {
    return { rows: [], count: 0, page, pageSize, error };
  }
}

export async function queryLeadsForExport(filters) {
  try {
    const params = buildDatabaseSearchParams(filters, { page: 1, limit: LEADS_EXPORT_LIMIT });
    const data = await cloudflareDatabaseRequest(`/v1/admin/leads?${params}`);
    return { rows: data.rows ?? [], error: null };
  } catch (error) {
    return { rows: [], error };
  }
}
