import {
  ASSET_TIER_LEVEL_OPTIONS,
  FOLLOW_UP_STATUS_OPTIONS,
  VALID_SERVICE_TYPE_VALUES,
} from "./constants";
import { cloudflareDatabaseRequest } from "./cloudflareDatabaseServer";

const VALID_FOLLOW_UP_STATUS = new Set(
  FOLLOW_UP_STATUS_OPTIONS.filter((item) => item.value !== "all").map(
    (item) => item.value
  )
);

const VALID_SERVICE_TYPES = new Set(VALID_SERVICE_TYPE_VALUES);

const VALID_CLIENT_GENDER = new Set(["male", "female"]);

const VALID_ASSET_TIER_LEVEL = new Set(
  ASSET_TIER_LEVEL_OPTIONS.map((item) => item.value)
);

function cleanText(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeServiceTypes(values) {
  const selected = values
    .map((value) => value.trim())
    .filter((value) => VALID_SERVICE_TYPES.has(value));

  if (selected.length === 0 || selected.includes("none")) {
    return ["none"];
  }

  return Array.from(new Set(selected));
}

function normalizeTimestamp(value) {
  const text = cleanText(value);
  if (!text) return null;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeNonNegativeInteger(value) {
  const text = cleanText(value);
  if (!text || !/^\d+$/.test(text)) return null;

  const number = Number(text);
  if (!Number.isSafeInteger(number) || number < 0) return null;
  return number;
}

function normalizeClientGender(value) {
  const text = cleanText(value);
  if (!text) return null;
  return VALID_CLIENT_GENDER.has(text) ? text : null;
}

function normalizeAssetTierLevel(value) {
  const text = cleanText(value);
  if (!text) return null;
  return VALID_ASSET_TIER_LEVEL.has(text) ? text : null;
}

export async function getLeadDetail(id) {
  try {
    const row = await cloudflareDatabaseRequest(`/v1/admin/leads/${encodeURIComponent(id)}`);
    return { row, error: null };
  } catch (error) {
    return { row: null, error };
  }
}

export async function updateLeadDetail(id, formData, operatorName) {
  const followUpStatus = cleanText(formData.get("follow_up_status")) ?? "new";
  const now = new Date().toISOString();

  const payload = {
    follow_up_status: VALID_FOLLOW_UP_STATUS.has(followUpStatus)
      ? followUpStatus
      : "new",
    service_type: normalizeServiceTypes(formData.getAll("service_type")),
    assigned_to: cleanText(formData.get("assigned_to")),
    appointment_owner: cleanText(formData.get("appointment_owner")),
    appointment_time: normalizeTimestamp(formData.get("appointment_time")),
    client_age: normalizeNonNegativeInteger(formData.get("client_age")),
    client_gender: normalizeClientGender(formData.get("client_gender")),
    client_location: cleanText(formData.get("client_location")),
    asset_tier_level: normalizeAssetTierLevel(
      formData.get("asset_tier_level")
    ),
    marital_dispute_summary: cleanText(
      formData.get("marital_dispute_summary")
    ),
    admin_note: cleanText(formData.get("admin_note")),
    report_version: cleanText(formData.get("report_version")),
    last_follow_up_at: now,
    updated_at: now,
    updated_by: cleanText(operatorName) ?? "admin_mvp",
  };

  try {
    await cloudflareDatabaseRequest(`/v1/admin/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: payload,
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function markLeadReportPreviewGenerated(id) {
  try {
    const row = await cloudflareDatabaseRequest(
      `/v1/admin/leads/${encodeURIComponent(id)}/report-preview`,
      { method: "POST" }
    );
    return { row, error: null };
  } catch (error) {
    return { row: null, error };
  }
}
