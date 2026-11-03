export function getScore(value, reverse = false) {
  if (value === "na" || value === undefined || value === null) return null;
  if (typeof value !== "number") return null;
  return reverse ? 6 - value : value;
}

export function getLevelKey(scoreRate) {
  if (scoreRate > 80) return "high";
  if (scoreRate >= 60) return "mid";
  return "low";
}

export function formatRate(rate) {
  if (!Number.isFinite(rate)) return "0.0%";
  return `${rate.toFixed(1)}%`;
}