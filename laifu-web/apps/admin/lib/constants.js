export const FOLLOW_UP_STATUS_OPTIONS = [
  { value: "all", label: "全部跟进状态" },
  { value: "new", label: "新提交" },
  { value: "to_follow", label: "待联系" },
  { value: "contacted", label: "已联系" },
  { value: "consulting", label: "咨询中" },
  { value: "converted", label: "已转化" },
  { value: "invalid", label: "无效线索" },
];

export const SERVICE_TYPE_OPTIONS = [
  { value: "all", label: "全部服务类型" },
  { value: "none", label: "未明确" },
  { value: "consultation", label: "咨询服务" },
  { value: "package_divorce", label: "包离服务" },
  { value: "divorce_companion", label: "离婚陪跑" },
  { value: "litigation_agent", label: "诉讼代理" },
  { value: "agreement_document", label: "协议文书" },
  { value: "divorce_negotiation", label: "离婚谈判" },
  { value: "cross_border_selection", label: "跨境甄选" },
  { value: "other", label: "其他" },
];

const LEGACY_SERVICE_TYPE_LABELS = {
  single_consultation: "单次咨询（历史选项）",
  divorce_escorting: "离婚陪跑（历史选项）",
  long_term_consultation: "长期咨询（历史选项）",
  screening_service: "甄选服务（历史选项）",
  litigation_representation: "诉讼代理（历史选项）",
  agreement_support: "协议离婚协助（历史选项）",
  cross_border_support: "跨境专项支持（历史选项）",
};

export const VALID_SERVICE_TYPE_VALUES = [
  ...SERVICE_TYPE_OPTIONS.filter((item) => item.value !== "all").map(
    (item) => item.value
  ),
  ...Object.keys(LEGACY_SERVICE_TYPE_LABELS),
];

export const ASSET_TIER_LEVEL_OPTIONS = [
  { value: "A5", label: "A5" },
  { value: "A5.5", label: "A5.5" },
  { value: "A6", label: "A6" },
  { value: "A6.5", label: "A6.5" },
  { value: "A7", label: "A7" },
  { value: "A7.5", label: "A7.5" },
  { value: "A8", label: "A8" },
  { value: "A8.5", label: "A8.5" },
  { value: "A9", label: "A9" },
  { value: "A9.5", label: "A9.5" },
  { value: "A10", label: "A10" },
  { value: "A10.5", label: "A10.5" },
  { value: "A11", label: "A11" },
];

const RESULT_LEVEL_FILTER_OPTIONS = [
  { value: "all", label: "全部结果等级" },
  { value: "high", label: "从容通关者" },
  { value: "medium", label: "稳健备战者" },
  { value: "low", label: "急速蓄力者" },
];

const RESULT_LEVEL_ALIASES = {
  high: "high",
  medium: "medium",
  mid: "medium",
  low: "low",
};

const followUpLabelMap = FOLLOW_UP_STATUS_OPTIONS.reduce((acc, item) => {
  if (item.value !== "all") acc[item.value] = item.label;
  return acc;
}, {});

const serviceTypeLabelMap = SERVICE_TYPE_OPTIONS.reduce((acc, item) => {
  if (item.value !== "all") acc[item.value] = item.label;
  return acc;
}, { ...LEGACY_SERVICE_TYPE_LABELS });

const resultLevelLabelMap = RESULT_LEVEL_FILTER_OPTIONS.reduce((acc, item) => {
  if (item.value !== "all") acc[item.value] = item.label;
  return acc;
}, {});

export function getFollowUpStatusLabel(value) {
  if (!value) return "-";
  return followUpLabelMap[value] ?? value;
}

export function getServiceTypeLabel(value) {
  if (!value) return "-";
  return serviceTypeLabelMap[value] ?? value;
}

function normalizeResultLevel(value) {
  if (!value) return "";
  return RESULT_LEVEL_ALIASES[value] ?? value;
}

export function getResultLevelLabel(value) {
  const normalized = normalizeResultLevel(value);
  if (!normalized) return "-";
  return resultLevelLabelMap[normalized] ?? normalized;
}
