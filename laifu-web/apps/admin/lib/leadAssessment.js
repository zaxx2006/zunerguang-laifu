const NARCISSISM_RISK_ASSESSMENT_TYPE = "spousal_narcissism_risk";
const DIVORCE_SCALE_ASSESSMENT_TYPE = "divorce_readiness";
const LEGACY_DIVORCE_SCALE_ASSESSMENT_TYPE = "divorce_scale";
const UNKNOWN_ASSESSMENT_TYPE = "unknown";

const ASSESSMENT_TYPE_FILTER_VALUES = {
  all: "all",
  divorce: DIVORCE_SCALE_ASSESSMENT_TYPE,
  narcissism: NARCISSISM_RISK_ASSESSMENT_TYPE,
};

export const ASSESSMENT_TYPE_FILTER_OPTIONS = [
  { value: ASSESSMENT_TYPE_FILTER_VALUES.all, label: "全部量表" },
  { value: ASSESSMENT_TYPE_FILTER_VALUES.divorce, label: "离婚力量表" },
  {
    value: ASSESSMENT_TYPE_FILTER_VALUES.narcissism,
    label: "配偶高自恋风险量表",
  },
];

const SERVICE_INTENT_FILTER_VALUES = {
  all: "all",
  legal: "legal_support",
  psychological: "psychological_support",
  deepReport: "deep_report",
  professional: "professional_support",
  none: "none",
};

export const SERVICE_INTENT_FILTER_OPTIONS = [
  { value: SERVICE_INTENT_FILTER_VALUES.all, label: "全部意向" },
  { value: SERVICE_INTENT_FILTER_VALUES.legal, label: "需要法律支持" },
  { value: SERVICE_INTENT_FILTER_VALUES.psychological, label: "需要心理支持" },
  { value: SERVICE_INTENT_FILTER_VALUES.deepReport, label: "仅需深度报告" },
  {
    value: SERVICE_INTENT_FILTER_VALUES.professional,
    label: "需要专业支持（旧）",
  },
  { value: SERVICE_INTENT_FILTER_VALUES.none, label: "未选择" },
];

const RESULT_LEVEL_FILTER_VALUES = {
  all: "all",
  divorceHigh: "divorce_high",
  divorceMid: "divorce_mid",
  divorceLow: "divorce_low",
  narcissismLow: "narcissism_low",
  narcissismMild: "narcissism_mild",
  narcissismModerate: "narcissism_moderate",
  narcissismHigh: "narcissism_high",
};

const DIVORCE_RESULT_LEVEL_FILTER_OPTIONS = [
  { value: RESULT_LEVEL_FILTER_VALUES.all, label: "全部结果等级" },
  { value: RESULT_LEVEL_FILTER_VALUES.divorceHigh, label: "从容通关者" },
  { value: RESULT_LEVEL_FILTER_VALUES.divorceMid, label: "稳健备战者" },
  { value: RESULT_LEVEL_FILTER_VALUES.divorceLow, label: "急速蓄力者" },
];

const NARCISSISM_RESULT_LEVEL_FILTER_OPTIONS = [
  { value: RESULT_LEVEL_FILTER_VALUES.all, label: "全部结果等级" },
  { value: RESULT_LEVEL_FILTER_VALUES.narcissismLow, label: "低风险" },
  { value: RESULT_LEVEL_FILTER_VALUES.narcissismMild, label: "轻度风险" },
  { value: RESULT_LEVEL_FILTER_VALUES.narcissismModerate, label: "中度风险" },
  { value: RESULT_LEVEL_FILTER_VALUES.narcissismHigh, label: "高风险" },
];

const ALL_RESULT_LEVEL_FILTER_OPTIONS = [
  { value: RESULT_LEVEL_FILTER_VALUES.all, label: "全部结果等级" },
  { value: RESULT_LEVEL_FILTER_VALUES.divorceHigh, label: "离婚力｜从容通关者" },
  { value: RESULT_LEVEL_FILTER_VALUES.divorceMid, label: "离婚力｜稳健备战者" },
  { value: RESULT_LEVEL_FILTER_VALUES.divorceLow, label: "离婚力｜急速蓄力者" },
  { value: RESULT_LEVEL_FILTER_VALUES.narcissismLow, label: "自恋风险｜低风险" },
  { value: RESULT_LEVEL_FILTER_VALUES.narcissismMild, label: "自恋风险｜轻度风险" },
  {
    value: RESULT_LEVEL_FILTER_VALUES.narcissismModerate,
    label: "自恋风险｜中度风险",
  },
  { value: RESULT_LEVEL_FILTER_VALUES.narcissismHigh, label: "自恋风险｜高风险" },
];

const RESULT_LEVEL_FILTER_META = {
  [RESULT_LEVEL_FILTER_VALUES.divorceHigh]: {
    assessmentType: ASSESSMENT_TYPE_FILTER_VALUES.divorce,
    resultLevels: ["high"],
  },
  [RESULT_LEVEL_FILTER_VALUES.divorceMid]: {
    assessmentType: ASSESSMENT_TYPE_FILTER_VALUES.divorce,
    resultLevels: ["medium", "mid"],
  },
  [RESULT_LEVEL_FILTER_VALUES.divorceLow]: {
    assessmentType: ASSESSMENT_TYPE_FILTER_VALUES.divorce,
    resultLevels: ["low"],
  },
  [RESULT_LEVEL_FILTER_VALUES.narcissismLow]: {
    assessmentType: ASSESSMENT_TYPE_FILTER_VALUES.narcissism,
    resultLevels: ["low"],
  },
  [RESULT_LEVEL_FILTER_VALUES.narcissismMild]: {
    assessmentType: ASSESSMENT_TYPE_FILTER_VALUES.narcissism,
    resultLevels: ["mild"],
  },
  [RESULT_LEVEL_FILTER_VALUES.narcissismModerate]: {
    assessmentType: ASSESSMENT_TYPE_FILTER_VALUES.narcissism,
    resultLevels: ["moderate"],
  },
  [RESULT_LEVEL_FILTER_VALUES.narcissismHigh]: {
    assessmentType: ASSESSMENT_TYPE_FILTER_VALUES.narcissism,
    resultLevels: ["high"],
  },
};

const LEGACY_DIVORCE_RESULT_LEVEL_FILTER_MAP = {
  high: RESULT_LEVEL_FILTER_VALUES.divorceHigh,
  medium: RESULT_LEVEL_FILTER_VALUES.divorceMid,
  mid: RESULT_LEVEL_FILTER_VALUES.divorceMid,
  low: RESULT_LEVEL_FILTER_VALUES.divorceLow,
};

const LEGACY_NARCISSISM_RESULT_LEVEL_FILTER_MAP = {
  high: RESULT_LEVEL_FILTER_VALUES.narcissismHigh,
  moderate: RESULT_LEVEL_FILTER_VALUES.narcissismModerate,
  mild: RESULT_LEVEL_FILTER_VALUES.narcissismMild,
  low: RESULT_LEVEL_FILTER_VALUES.narcissismLow,
};

const ASSESSMENT_TYPE_LABELS = {
  [DIVORCE_SCALE_ASSESSMENT_TYPE]: "离婚力量表",
  [NARCISSISM_RISK_ASSESSMENT_TYPE]: "配偶高自恋风险量表",
  [UNKNOWN_ASSESSMENT_TYPE]: "未知量表",
};

const ASSESSMENT_TYPE_SHORT_LABELS = {
  [DIVORCE_SCALE_ASSESSMENT_TYPE]: "离婚力",
  [NARCISSISM_RISK_ASSESSMENT_TYPE]: "自恋风险",
  [UNKNOWN_ASSESSMENT_TYPE]: "未知量表",
};

const SERVICE_INTENT_LABELS = {
  legal_support: "需要法律支持",
  psychological_support: "需要心理支持",
  deep_report: "仅需深度报告",
  professional_support: "需要专业支持（旧）",
  none: "未选择",
};

const NARCISSISM_RESULT_LEVEL_LABELS = {
  low: "低风险",
  mild: "轻度风险",
  moderate: "中度风险",
  high: "高风险",
};

const NARCISSISM_DIMENSION_LABELS = {
  N1: "自我中心与关系特权",
  N2: "人设包装与反应升级",
  N3: "情感忽视与责任推脱",
  N4: "控制施压与关系操控",
  N5: "冲突升级与安全风险",
};

const NARCISSISM_RISK_DIMENSION_ORDER = ["N1", "N2", "N3", "N4", "N5"];

const NARCISSISM_RISK_DIMENSIONS = {
  N1: {
    code: "N1",
    name: "自我中心与关系特权",
    shortName: "自我中心",
  },
  N2: {
    code: "N2",
    name: "人设包装与反应升级",
    shortName: "受挫反应",
  },
  N3: {
    code: "N3",
    name: "情感忽视与责任推脱",
    shortName: "情感回应",
  },
  N4: {
    code: "N4",
    name: "控制施压与关系操控",
    shortName: "关系施压",
  },
  N5: {
    code: "N5",
    name: "冲突升级与安全风险",
    shortName: "冲突升级",
  },
};

const NARCISSISM_RISK_ANSWER_OPTIONS = [
  { label: "完全不符合", value: 1 },
  { label: "不太符合", value: 2 },
  { label: "一般符合", value: 3 },
  { label: "基本符合", value: 4 },
  { label: "完全符合", value: 5 },
];

const NARCISSISM_RISK_NA_VALUE = "na";
const NARCISSISM_RISK_REVERSE_QUESTION_IDS = new Set([
  "N1_Q07",
  "N2_Q13",
  "N3_Q22",
  "N4_Q32",
  "N5_Q40",
]);
const NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS = new Set([
  "N5_Q34",
  "N5_Q35",
  "N5_Q36",
  "N5_Q37",
]);

const NARCISSISM_RISK_QUESTION_TEXTS = {
  N1_Q01:
    "在家庭沟通或重要决策中，对方常默认自己的判断应当成为最终决定。",
  N1_Q02:
    "对方在婚姻关系中经常期待获得特殊照顾、特殊待遇或更多资源。",
  N1_Q03:
    "当家庭规则、共同约定或外部规则限制到对方时，对方容易认为“这些规则不该适用于自己”。",
  N1_Q04:
    "对方习惯把婚姻中的分歧理解为“对方不尊重自己”或“没有把自己放在应有的位置”。",
  N1_Q05:
    "对方经常强调自己的付出、能力、地位或资源，以证明自己在婚姻中应当拥有更大话语权。",
  N1_Q06:
    "对方会把您或孩子的表现与自己的面子、价值或社会评价绑定，一旦不符合其期待就明显不满。",
  N1_Q07:
    "对方能够承认婚姻中的重要决定需要双方共同协商，而不是由自己单方面决定。",
  N1_Q08:
    "在涉及财产、住房、子女安排或家庭责任时，对方常认为自己应当获得更优先的安排。",
  N2_Q09:
    "对方很在意他人的赞赏和认同，一旦没有得到期待中的肯定，情绪或态度会明显变化。",
  N2_Q10:
    "当您指出对方的问题时，对方很少先理解问题本身，而是迅速进入辩解、反驳或反击状态。",
  N2_Q11: "对方容易把普通的不同意见理解为冒犯、轻视或否定。",
  N2_Q12:
    "在争吵、协商或调解中，只要对方感觉自己“输了”或“不占上风”，反应就会明显升级。",
  N2_Q13:
    "对方面对批评或质疑时，能够相对平静地听完，并愿意讨论具体问题。",
  N2_Q14: "对方在被指出错误后，容易贬低您、翻旧账或质疑您的动机。",
  N2_Q15:
    "在财产、子女、面子或外界评价相关议题上，对方若没有得到预期结果，容易表现出强烈不甘或报复性表达。",
  N2_Q16: "对方事后会反复纠结自己在冲突中是否丢脸、被看低或被否定。",
  N3_Q17:
    "当您表达压力、委屈或痛苦时，对方常表现出不耐烦、冷漠、嘲讽或指责。",
  N3_Q18: "对方很少主动关心您或孩子在关系中的真实感受和压力。",
  N3_Q19:
    "婚姻中出现问题时，对方常把责任主要归咎于您、您的家人或外部环境。",
  N3_Q20:
    "对方会把您的正常情绪反应描述成“太敏感”“想太多”“不讲理”或“有问题”。",
  N3_Q21:
    "在子女议题中，对方更关注孩子是否站在自己一边、维护自己的面子或满足自己的情绪，而较少关注孩子的真实感受。",
  N3_Q22: "当您明确表达边界或拒绝某些要求时，对方能够尊重您的感受和决定。",
  N3_Q23:
    "即使对方的行为已经让您或孩子受到伤害，对方仍倾向于否认、淡化或转移责任。",
  N3_Q24: "对方经常要求您理解他的压力和立场，却很少同等理解您的处境。",
  N4_Q25: "对方会通过钱款、财产使用或家庭资源安排，对您施加压力，使您作出让步。",
  N4_Q26: "对方会通过内疚感、道德指责或亲友评价，使您接受其要求。",
  N4_Q27: "对方常向第三方呈现对自己有利的婚姻叙事，使您难以解释完整事实。",
  N4_Q28: "对方会让亲友或孩子传话、站队或证明其说法，使他们卷入您与对方的冲突。",
  N4_Q29:
    "在双方沟通关键争议时，对方常通过转移话题、混淆重点、否认事实或诡辩来绕开核心问题。",
  N4_Q30:
    "对方经常否认曾经说过或做过的事，并反过来让您怀疑自己的记忆、感受或判断。",
  N4_Q31:
    "对方会把孩子、亲友关系或共同财产作为谈判筹码，使您在坚持边界时承受更多压力。",
  N4_Q32: "在婚姻冲突中，对方能够尊重事实，不刻意操控他人对您或关系的看法。",
  N5_Q33: "对方经常把您的正常行为理解为恶意、算计、背叛或故意针对。",
  N5_Q34: "在冲突中，对方曾通过威胁、恐吓、羞辱、持续骚扰或上门纠缠来迫使您让步。",
  N5_Q35: "对方曾公开或威胁公开您的隐私、聊天记录、照片、家庭矛盾或其他敏感信息。",
  N5_Q36: "对方在矛盾中曾出现摔东西、破坏财物、堵门、抢夺物品、限制行动等行为。",
  N5_Q37:
    "对方曾以自伤、自杀、伤害您、伤害孩子或伤害他人作为威胁，要求您妥协、复合或放弃某些主张。",
  N5_Q38:
    "在分居、协商或离婚过程中，对方会反复拖延、改变说法或制造程序性消耗，使问题难以真正解决。",
  N5_Q39:
    "对方会故意触碰您的敏感点或反复挑衅，等您情绪失控后，再指责您不理性或有问题。",
  N5_Q40: "即使发生严重分歧，对方也能避免威胁、骚扰、公开隐私或其他升级冲突的行为。",
};

const NARCISSISM_RISK_QUESTIONS = Array.from({ length: 40 }, (_, index) => {
  const questionNo = index + 1;
  const dimensionCode = `N${Math.ceil(questionNo / 8)}`;
  const questionId = `${dimensionCode}_Q${String(questionNo).padStart(2, "0")}`;
  const dimension = NARCISSISM_RISK_DIMENSIONS[dimensionCode];

  return {
    question_id: questionId,
    question_no: questionNo,
    question_text: NARCISSISM_RISK_QUESTION_TEXTS[questionId],
    dimension_code: dimensionCode,
    dimension_name: dimension.name,
    reverse_scored: NARCISSISM_RISK_REVERSE_QUESTION_IDS.has(questionId),
    high_risk_trigger: NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS.has(questionId),
  };
});

const NARCISSISM_RISK_QUESTION_MAP = Object.fromEntries(
  NARCISSISM_RISK_QUESTIONS.map((question) => [question.question_id, question])
);

function isBlank(value) {
  return value === null || value === undefined || String(value).trim() === "";
}

function getRecordPayload(record) {
  const payload = record?.result_payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }
  return payload;
}

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeArrayValue(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [value];
}

function getSafeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function getBooleanOrNull(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue === "true") return true;
    if (normalizedValue === "false") return false;
  }
  return null;
}

function getFirstBooleanOrFalse(...values) {
  for (const value of values) {
    const booleanValue = getBooleanOrNull(value);
    if (booleanValue !== null) return booleanValue;
  }

  return false;
}

function getQuestionIdByQuestionNo(questionNo) {
  const normalizedQuestionNo = toNumberOrNull(questionNo);
  if (!normalizedQuestionNo) return "";

  return (
    NARCISSISM_RISK_QUESTIONS.find(
      (question) => question.question_no === normalizedQuestionNo
    )?.question_id ?? ""
  );
}

function normalizeQuestionId(value) {
  if (!value) return "";

  if (typeof value === "object" && !Array.isArray(value)) {
    const explicitId =
      value.question_id ??
      value.questionId ??
      value.id ??
      value.question;
    if (explicitId) return normalizeQuestionId(explicitId);

    return getQuestionIdByQuestionNo(
      value.question_no ?? value.questionNo ?? value.question_number
    );
  }

  const text = String(value).trim();
  const matchedQuestionId = text.match(/N[1-5]_Q\d{2}/i)?.[0];
  if (matchedQuestionId) return matchedQuestionId.toUpperCase();

  if (/^\d+$/.test(text)) {
    return getQuestionIdByQuestionNo(text);
  }

  return text;
}

function normalizeNarcissismAnswerMap(value) {
  if (!value) return {};

  if (Array.isArray(value)) {
    return Object.fromEntries(
      value
        .map((item) => [normalizeQuestionId(item), item])
        .filter(([questionId]) => Boolean(questionId))
    );
  }

  if (typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, answer]) => [normalizeQuestionId(key) || normalizeQuestionId(answer), answer])
      .filter(([questionId]) => Boolean(questionId))
  );
}

function getNarcissismAnswerObject(record) {
  const answers = normalizeNarcissismAnswerMap(record?.answers);
  if (Object.keys(answers).length > 0) return answers;

  return normalizeNarcissismAnswerMap(getRecordPayload(record).answers);
}

function getAnswerRawScore(answer) {
  if (answer && typeof answer === "object" && !Array.isArray(answer)) {
    return answer.raw_score ?? answer.rawScore ?? answer.value ?? answer.answer;
  }

  return answer;
}

function getAnswerScore(answer) {
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
    return null;
  }

  return toNumberOrNull(answer.score ?? answer.actual_score ?? answer.actualScore);
}

function getAnswerLabel(answer) {
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
    return "";
  }

  return String(
    answer.selected_label ??
      answer.selectedLabel ??
      answer.answer_label ??
      answer.answerLabel ??
      answer.label ??
      ""
  ).trim();
}

function getAnswerIsNa(answer, rawScore) {
  if (answer && typeof answer === "object" && !Array.isArray(answer)) {
    const explicitValue = getBooleanOrNull(answer.is_na ?? answer.isNa);
    if (explicitValue !== null) return explicitValue;
  }

  return String(rawScore ?? "").trim().toLowerCase() === NARCISSISM_RISK_NA_VALUE;
}

function formatNarcissismRawScore(rawScore, isNa, answer) {
  if (isNa) return "与本人情况无关";

  const score = toNumberOrNull(rawScore);
  const answerLabel = getAnswerLabel(answer);
  if (answerLabel && score !== null) return `${score}：${answerLabel}`;
  if (answerLabel) return answerLabel;

  const option = NARCISSISM_RISK_ANSWER_OPTIONS.find(
    (item) => item.value === score
  );

  if (option) return `${score}：${option.label}`;
  if (rawScore === null || rawScore === undefined || rawScore === "") return "-";
  return String(rawScore);
}

function getNarcissismHighRiskItems(record) {
  const payload = getRecordPayload(record);
  const triggerItems =
    payload.high_risk_triggers ?? payload.high_risk_items ?? [];
  return normalizeArrayValue(triggerItems);
}

function formatHighRiskItem(item) {
  if (!item) return "";

  if (typeof item === "object" && !Array.isArray(item)) {
    const rawQuestionNo =
      item.question_no ?? item.questionNo ?? item.question_number;
    const questionNo = rawQuestionNo ? String(rawQuestionNo).trim() : "";
    const id = item.question_id ?? item.id ?? "";
    const label = questionNo || formatHighRiskItem(id);
    const text = item.question_text ?? item.text ?? "";

    if (!text) return label;
    const shortText = String(text).trim().slice(0, 40);
    return label ? `${label}：${shortText}` : shortText;
  }

  const text = String(item).trim();
  const questionNo = text.match(/Q0*(\d+)/i)?.[1];
  return questionNo ? String(Number(questionNo)) : text;
}

function getDimensionScores(record) {
  const payload = getRecordPayload(record);
  const directScores =
    record?.dimension_scores && typeof record.dimension_scores === "object"
      ? record.dimension_scores
      : payload.dimension_scores;

  if (directScores && typeof directScores === "object" && !Array.isArray(directScores)) {
    return directScores;
  }

  const details = payload.dimension_details;
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(details)
      .map(([code, detail]) => [code, toNumberOrNull(detail?.score)])
      .filter(([, score]) => score !== null)
  );
}

function getAssessmentTypeKey(record) {
  const value =
    typeof record === "string" || record === null || record === undefined
      ? record
      : record.assessment_type;

  if (value === NARCISSISM_RISK_ASSESSMENT_TYPE) {
    return NARCISSISM_RISK_ASSESSMENT_TYPE;
  }

  if (
    value === DIVORCE_SCALE_ASSESSMENT_TYPE ||
    value === LEGACY_DIVORCE_SCALE_ASSESSMENT_TYPE
  ) {
    return DIVORCE_SCALE_ASSESSMENT_TYPE;
  }

  if (isBlank(value)) {
    return DIVORCE_SCALE_ASSESSMENT_TYPE;
  }

  return UNKNOWN_ASSESSMENT_TYPE;
}

export function isNarcissismRiskRecord(record) {
  return getAssessmentTypeKey(record) === NARCISSISM_RISK_ASSESSMENT_TYPE;
}

export function isDivorceReadinessRecord(record) {
  return getAssessmentTypeKey(record) === DIVORCE_SCALE_ASSESSMENT_TYPE;
}

export function getAssessmentTypeLabel(record) {
  return ASSESSMENT_TYPE_LABELS[getAssessmentTypeKey(record)];
}

export function getAssessmentTypeShortLabel(record) {
  return ASSESSMENT_TYPE_SHORT_LABELS[getAssessmentTypeKey(record)];
}

export function normalizeAssessmentTypeFilterValue(value) {
  if (value === ASSESSMENT_TYPE_FILTER_VALUES.narcissism) {
    return ASSESSMENT_TYPE_FILTER_VALUES.narcissism;
  }

  if (
    value === ASSESSMENT_TYPE_FILTER_VALUES.divorce ||
    value === LEGACY_DIVORCE_SCALE_ASSESSMENT_TYPE
  ) {
    return ASSESSMENT_TYPE_FILTER_VALUES.divorce;
  }

  return ASSESSMENT_TYPE_FILTER_VALUES.all;
}

export function getResultLevelFilterOptions(assessmentType) {
  const normalizedAssessmentType =
    normalizeAssessmentTypeFilterValue(assessmentType);

  if (normalizedAssessmentType === ASSESSMENT_TYPE_FILTER_VALUES.divorce) {
    return DIVORCE_RESULT_LEVEL_FILTER_OPTIONS;
  }

  if (normalizedAssessmentType === ASSESSMENT_TYPE_FILTER_VALUES.narcissism) {
    return NARCISSISM_RESULT_LEVEL_FILTER_OPTIONS;
  }

  return ALL_RESULT_LEVEL_FILTER_OPTIONS;
}

export function normalizeResultLevelFilterValue(value, assessmentType) {
  const rawValue = String(value ?? "").trim();
  if (!rawValue || rawValue === RESULT_LEVEL_FILTER_VALUES.all) {
    return RESULT_LEVEL_FILTER_VALUES.all;
  }

  const normalizedAssessmentType =
    normalizeAssessmentTypeFilterValue(assessmentType);
  let normalizedValue = rawValue;

  if (!RESULT_LEVEL_FILTER_META[normalizedValue]) {
    if (normalizedAssessmentType === ASSESSMENT_TYPE_FILTER_VALUES.narcissism) {
      normalizedValue =
        LEGACY_NARCISSISM_RESULT_LEVEL_FILTER_MAP[rawValue] ?? rawValue;
    } else if (normalizedAssessmentType === ASSESSMENT_TYPE_FILTER_VALUES.divorce) {
      normalizedValue =
        LEGACY_DIVORCE_RESULT_LEVEL_FILTER_MAP[rawValue] ?? rawValue;
    } else {
      normalizedValue =
        LEGACY_DIVORCE_RESULT_LEVEL_FILTER_MAP[rawValue] ??
        LEGACY_NARCISSISM_RESULT_LEVEL_FILTER_MAP[rawValue] ??
        rawValue;
    }
  }

  const allowedValues = new Set(
    getResultLevelFilterOptions(normalizedAssessmentType).map(
      (option) => option.value
    )
  );

  return allowedValues.has(normalizedValue)
    ? normalizedValue
    : RESULT_LEVEL_FILTER_VALUES.all;
}

function getServiceIntentLabel(value) {
  if (isBlank(value)) return "未选择";
  return SERVICE_INTENT_LABELS[String(value).trim()] ?? "未知意向";
}

function getLeadServiceIntentValue(record) {
  if (!isBlank(record?.service_intent)) {
    return String(record.service_intent).trim();
  }

  const payload = getRecordPayload(record);
  if (!isBlank(payload.service_intent)) {
    return String(payload.service_intent).trim();
  }

  return "";
}

export function getLeadServiceIntentLabel(record) {
  return getServiceIntentLabel(getLeadServiceIntentValue(record));
}

export function getNarcissismResultLevelLabel(value) {
  if (isBlank(value)) return "-";
  return NARCISSISM_RESULT_LEVEL_LABELS[String(value).trim()] ?? String(value);
}

function getNarcissismAverageScore(record) {
  if (!isNarcissismRiskRecord(record)) return null;

  const payload = getRecordPayload(record);
  const payloadAverage = toNumberOrNull(payload.average_score);
  if (payloadAverage !== null) return payloadAverage;

  const totalScore = toNumberOrNull(record?.total_score);
  const validAnswerCount = toNumberOrNull(payload.valid_answer_count);
  if (totalScore !== null && validAnswerCount && validAnswerCount > 0) {
    return totalScore / validAnswerCount;
  }

  const dynamicFullScore = toNumberOrNull(record?.dynamic_full_score);
  if (totalScore !== null && dynamicFullScore && dynamicFullScore > 0) {
    return totalScore / (dynamicFullScore / 5);
  }

  return null;
}

export function formatNarcissismAverageScore(record, emptyValue = "-") {
  const score = getNarcissismAverageScore(record);
  if (score === null) return emptyValue;
  return `${score.toFixed(2)} / 5`;
}

export function getNarcissismValidAnswerCount(record) {
  if (!isNarcissismRiskRecord(record)) return null;
  return toNumberOrNull(getRecordPayload(record).valid_answer_count);
}

export function getNarcissismNaAnswerCount(record) {
  if (!isNarcissismRiskRecord(record)) return null;
  return toNumberOrNull(getRecordPayload(record).na_answer_count);
}

export function getNarcissismLowValidity(record) {
  if (!isNarcissismRiskRecord(record)) return null;
  const payload = getRecordPayload(record);
  if (typeof payload.low_validity === "boolean") return payload.low_validity;
  if (typeof payload.low_validity === "string") {
    return payload.low_validity.toLowerCase() === "true";
  }
  return null;
}

export function formatNarcissismLowValidity(record, emptyValue = "-") {
  const value = getNarcissismLowValidity(record);
  if (value === null) return emptyValue;
  return value ? "是" : "否";
}

export function getNarcissismHighRiskTriggered(record) {
  if (!isNarcissismRiskRecord(record)) return null;

  const highRiskItems = getNarcissismHighRiskItems(record);
  if (highRiskItems.length > 0) return true;

  const payload = getRecordPayload(record);
  if (typeof payload.high_risk_triggered === "boolean") {
    return payload.high_risk_triggered;
  }
  if (typeof payload.high_risk_triggered === "string") {
    return payload.high_risk_triggered.toLowerCase() === "true";
  }

  return false;
}

export function formatNarcissismHighRiskStatus(record, emptyValue = "-") {
  const value = getNarcissismHighRiskTriggered(record);
  if (value === null) return emptyValue;
  return value ? "已触发" : "未触发";
}

export function getNarcissismHighRiskTriggerSummary(record, emptyValue = "-") {
  if (!isNarcissismRiskRecord(record)) return emptyValue;

  const summary = getNarcissismHighRiskItems(record)
    .map(formatHighRiskItem)
    .filter(Boolean)
    .join(",");

  return summary || emptyValue;
}

export function getNarcissismDimensionSummary(record, emptyValue = "-") {
  if (!isNarcissismRiskRecord(record)) return emptyValue;

  const payload = getRecordPayload(record);
  const primaryDimensions = normalizeArrayValue(payload.primary_risk_dimensions)
    .map((item) => {
      const code =
        typeof item === "object" && item !== null
          ? item.code ?? item.dimension_code ?? item.dimension
          : item;
      return NARCISSISM_DIMENSION_LABELS[code] ?? code;
    })
    .filter(Boolean);

  if (primaryDimensions.length > 0) {
    return primaryDimensions.join("、");
  }

  const scoredDimensions = Object.entries(getDimensionScores(record))
    .map(([code, score]) => ({
      code,
      score: toNumberOrNull(score),
    }))
    .filter((item) => item.score !== null)
    .sort((left, right) => right.score - left.score)
    .slice(0, 2)
    .map((item) => NARCISSISM_DIMENSION_LABELS[item.code] ?? item.code);

  return scoredDimensions.length > 0
    ? scoredDimensions.join("、")
    : emptyValue;
}

export function getNarcissismDimensionRows(record) {
  if (!isNarcissismRiskRecord(record)) return [];

  const payload = getRecordPayload(record);
  const dimensionScores = getDimensionScores(record);
  const dimensionDetails = getSafeObject(payload.dimension_details);
  const dimensionValidity = getSafeObject(payload.dimension_validity);

  return NARCISSISM_RISK_DIMENSION_ORDER.map((code) => {
    const dimension = NARCISSISM_RISK_DIMENSIONS[code] ?? {};
    const detail = getSafeObject(dimensionDetails[code]);
    const validity = getSafeObject(dimensionValidity[code]);
    const score =
      toNumberOrNull(detail.score) ?? toNumberOrNull(dimensionScores[code]);

    return {
      code,
      name: dimension.name ?? NARCISSISM_DIMENSION_LABELS[code] ?? code,
      shortName: dimension.shortName ?? "",
      averageScore: score,
      validCount:
        toNumberOrNull(detail.valid_count) ??
        toNumberOrNull(detail.validCount) ??
        toNumberOrNull(validity.valid_count) ??
        toNumberOrNull(validity.validCount),
      naCount:
        toNumberOrNull(detail.na_count) ??
        toNumberOrNull(detail.naCount) ??
        toNumberOrNull(validity.na_count) ??
        toNumberOrNull(validity.naCount),
      insufficientValidity: getFirstBooleanOrFalse(
        detail.insufficient_validity,
        validity.insufficient_validity
      ),
      noValidAnswers: getFirstBooleanOrFalse(
        detail.no_valid_answers,
        validity.no_valid_answers
      ),
    };
  });
}

export function getNarcissismHighRiskTriggers(record) {
  if (!isNarcissismRiskRecord(record)) return [];

  const answers = getNarcissismAnswerObject(record);

  return getNarcissismHighRiskItems(record)
    .map((item, index) => {
      const questionId = normalizeQuestionId(item);
      const question = NARCISSISM_RISK_QUESTION_MAP[questionId] ?? {};
      const answer = questionId ? answers[questionId] : undefined;
      const rawScore = getAnswerRawScore(answer);
      const isNa = getAnswerIsNa(answer, rawScore);
      const itemObject = getSafeObject(item);

      return {
        key: `${questionId || "trigger"}-${index}`,
        questionId: questionId || "-",
        questionNo:
          itemObject.question_no ??
          itemObject.questionNo ??
          itemObject.question_number ??
          question.question_no ??
          "-",
        questionText:
          itemObject.question_text ??
          itemObject.questionText ??
          itemObject.text ??
          question.question_text ??
          "-",
        choice:
          itemObject.choice ??
          itemObject.answer_label ??
          itemObject.answerLabel ??
          formatNarcissismRawScore(rawScore, isNa, answer),
        score:
          toNumberOrNull(itemObject.score ?? itemObject.actual_score) ??
          getAnswerScore(answer),
      };
    })
    .filter((item) => item.questionId !== "-" || item.questionText !== "-");
}

export function getNarcissismAnswerRows(record) {
  if (!isNarcissismRiskRecord(record)) return [];

  const answers = getNarcissismAnswerObject(record);
  const knownQuestionIds = new Set(
    NARCISSISM_RISK_QUESTIONS.map((question) => question.question_id)
  );
  const extraQuestionRows = Object.keys(answers)
    .filter((questionId) => !knownQuestionIds.has(questionId))
    .map((questionId) => ({
      question_id: questionId,
      question_no: "-",
      dimension_code: "-",
      dimension_name: "",
      question_text: "题干未匹配，请核对题库版本。",
      reverse_scored: null,
      high_risk_trigger: null,
    }));

  return [...NARCISSISM_RISK_QUESTIONS, ...extraQuestionRows].map((question) => {
    const questionId = question.question_id;
    const answer = answers[questionId];
    const rawScore = getAnswerRawScore(answer);
    const isNa = getAnswerIsNa(answer, rawScore);
    const actualScore = getAnswerScore(answer);
    const answerObject = getSafeObject(answer);
    const reverseScored =
      question.reverse_scored === null
        ? getFirstBooleanOrFalse(
            answerObject.reverse_scored,
            answerObject.reverseScored
          )
        : Boolean(question.reverse_scored);
    const highRiskQuestion =
      question.high_risk_trigger === null
        ? getFirstBooleanOrFalse(
            answerObject.high_risk_trigger,
            answerObject.highRiskTrigger
          )
        : Boolean(question.high_risk_trigger);

    return {
      questionId,
      questionNo: question.question_no ?? "-",
      dimension:
        question.dimension_code && question.dimension_name
          ? `${question.dimension_code} ${question.dimension_name}`
          : question.dimension_code ?? "-",
      questionText: question.question_text ?? "题干未匹配，请核对题库版本。",
      choice:
        answer === undefined
          ? "未记录"
          : formatNarcissismRawScore(rawScore, isNa, answer),
      isNa: isNa ? "是" : "否",
      reverseScored: reverseScored ? "是" : "否",
      highRiskQuestion: highRiskQuestion ? "是" : "否",
      score:
        actualScore === null || actualScore === undefined
          ? isNa
            ? "不计分"
            : "-"
          : actualScore,
    };
  });
}
