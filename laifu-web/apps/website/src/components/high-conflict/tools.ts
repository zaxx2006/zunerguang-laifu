import { priorityKeys, type HighConflictPresentation } from "@/contracts/cms-high-conflict";

export function orderedPriorities(keys: readonly string[], items: HighConflictPresentation["priorities"]["items"]) {
  return priorityKeys.filter(key => keys.includes(key)).flatMap(key => items.filter(item => item.key === key));
}

export function consultationSummary(keys: readonly string[], content: HighConflictPresentation["priorities"]) {
  const items = orderedPriorities(keys, content.items);
  if (!items.length) return "";
  return [content.summaryTitle, content.summaryIntro, ...items.map((item, index) => `${index + 1}. ${item.label}\n${item.prompt}`)].join("\n\n");
}
