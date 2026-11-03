import { getServiceTypeLabel } from "./constants";

const SHANGHAI_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("zh-CN", { hour12: false, hourCycle: "h23", timeZone: "Asia/Shanghai" });
const SHANGHAI_INPUT_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-CA", { day: "2-digit", hour: "2-digit", hour12: false, hourCycle: "h23", minute: "2-digit", month: "2-digit", timeZone: "Asia/Shanghai", year: "numeric" });

export function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return SHANGHAI_DATE_TIME_FORMATTER.format(date);
}

export function formatScoreRate(value) {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return `${num.toFixed(1)}%`;
}

export function formatGateAnswer(value) {
  if (value === true || value === "yes") return "是";
  if (value === false || value === "no") return "否";
  return "-";
}

export function formatServiceTypes(value) {
  if (!value) return "-";
  if (Array.isArray(value) && value.length === 0) return "-";
  if (Array.isArray(value)) {
    return value.map((item) => getServiceTypeLabel(item)).join("、");
  }
  return getServiceTypeLabel(value);
}

export function formatArrayValue(value) {
  if (!value) return "-";
  if (!Array.isArray(value)) return String(value);
  if (value.length === 0) return "-";
  return value.join("、");
}

export function formatDateTimeInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = Object.fromEntries(SHANGHAI_INPUT_DATE_TIME_FORMATTER.formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
