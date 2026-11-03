import {
  NARCISSISM_RISK_REPORT_DIMENSION_ORDER,
  focusDimensionRules,
  getNarcissismRiskDimensionCopy,
  getNarcissismRiskOverallCopy,
  getNarcissismRiskTriggerCopy,
  highRiskTriggers,
  narcissismRiskDimensions,
  reportBoundary,
  validity,
} from "./narcissismRiskReportCopy.js";
import { teamIntroContent } from "./teamIntroContent.js";

const NARCISSISM_RISK_ASSESSMENT_TYPE = "spousal_narcissism_risk";
const NARCISSISM_RISK_DIMENSION_ORDER = NARCISSISM_RISK_REPORT_DIMENSION_ORDER;
const NARCISSISM_RISK_DIMENSIONS = narcissismRiskDimensions;
const NARCISSISM_RISK_LOW_VALID_ANSWER_THRESHOLD = 30;
const NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS = Object.values(highRiskTriggers)
  .map((item) => item.questionId)
  .filter(Boolean);
const NARCISSISM_RISK_QUESTION_MAP = Object.fromEntries(
  Object.values(highRiskTriggers)
    .filter((item) => item.questionId)
    .map((item) => [
      item.questionId,
      {
        question_id: item.questionId,
        question_no: item.questionNo,
        question_text: item.questionText,
      },
    ])
);

const REPORT_TITLE = {
  primary: "配偶高自恋特质与高冲突婚姻风险自测量表",
  secondary: "测评结果详细解读报告",
};

const LEVEL_LABELS = {
  low: "低风险",
  mild: "轻度风险",
  moderate: "中度风险",
  high: "高风险",
};

const HIGH_RISK_QUESTION_IDS = new Set(NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS);

function getSafeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function roundToTwo(value) {
  const number = toNumberOrNull(value);
  return number === null ? null : Number(number.toFixed(2));
}

function normalizeLevel(value) {
  if (value === "medium") return "moderate";
  return ["low", "mild", "moderate", "high"].includes(value) ? value : null;
}

function getLevelByScore(score) {
  const normalizedScore = toNumberOrNull(score);
  if (normalizedScore === null || normalizedScore < 1 || normalizedScore > 5) {
    return null;
  }

  if (normalizedScore < 2) return "low";
  if (normalizedScore < 3) return "mild";
  if (normalizedScore <= 3.5) return "moderate";
  return "high";
}

function getPayload(record) {
  return getSafeObject(record?.result_payload);
}

function getDimensionDetails(payload) {
  return getSafeObject(payload.dimension_details);
}

function getDimensionValidity(payload) {
  return getSafeObject(payload.dimension_validity);
}

function getDimensionScore(record, payload, code) {
  const rootScores = getSafeObject(record?.dimension_scores);
  const payloadScores = getSafeObject(payload.dimension_scores);
  const details = getDimensionDetails(payload);

  return (
    toNumberOrNull(details[code]?.score) ??
    toNumberOrNull(rootScores[code]) ??
    toNumberOrNull(payloadScores[code])
  );
}

function getDimensionCount(detail, validityItem, key) {
  const camelKey =
    key === "valid_count" ? "validCount" : key === "na_count" ? "naCount" : key;

  return (
    toNumberOrNull(detail?.[key]) ??
    toNumberOrNull(detail?.[camelKey]) ??
    toNumberOrNull(validityItem?.[key]) ??
    toNumberOrNull(validityItem?.[camelKey])
  );
}

function getBooleanValue(...values) {
  for (const value of values) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") return true;
      if (normalized === "false") return false;
    }
  }

  return false;
}

function normalizeQuestionId(value) {
  if (!value) return "";

  if (typeof value === "object" && !Array.isArray(value)) {
    return normalizeQuestionId(
      value.question_id ??
        value.questionId ??
        value.id ??
        value.question ??
        value.question_no ??
        value.questionNo ??
        value.question_number
    );
  }

  const text = String(value).trim();
  const matchedQuestionId = text.match(/N5_Q3[4-7]/i)?.[0];
  if (matchedQuestionId) return matchedQuestionId.toUpperCase();

  const matchedQuestionNo = text.match(/Q?0*(3[4-7])$/i)?.[1];
  if (matchedQuestionNo) return `N5_Q${matchedQuestionNo}`;

  return text;
}

function normalizeAnswerMap(answers) {
  if (!answers) return {};

  if (Array.isArray(answers)) {
    return Object.fromEntries(
      answers
        .map((answer) => [normalizeQuestionId(answer), answer])
        .filter(([questionId]) => Boolean(questionId))
    );
  }

  if (typeof answers !== "object") return {};

  return Object.fromEntries(
    Object.entries(answers)
      .map(([key, answer]) => [
        normalizeQuestionId(key) || normalizeQuestionId(answer),
        answer,
      ])
      .filter(([questionId]) => Boolean(questionId))
  );
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

function getAnswerChoiceLabel(answer, rawScore) {
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
    return rawScore === undefined || rawScore === null || rawScore === ""
      ? ""
      : String(rawScore);
  }

  return String(
    answer.selected_label ??
      answer.selectedLabel ??
      answer.answer_label ??
      answer.answerLabel ??
      answer.label ??
      rawScore ??
      ""
  ).trim();
}

function buildDimensionSummaries(record, payload) {
  const details = getDimensionDetails(payload);
  const validityMap = getDimensionValidity(payload);

  return NARCISSISM_RISK_DIMENSION_ORDER.map((code) => {
    const dimensionMeta = NARCISSISM_RISK_DIMENSIONS[code] ?? {};
    const detail = getSafeObject(details[code]);
    const validityItem = getSafeObject(validityMap[code]);
    const averageScore = roundToTwo(getDimensionScore(record, payload, code));
    const noValidAnswers = getBooleanValue(
      detail.no_valid_answers,
      detail.noValidAnswers,
      validityItem.no_valid_answers,
      validityItem.noValidAnswers
    );
    const insufficientValidity = getBooleanValue(
      detail.insufficient_validity,
      detail.insufficientValidity,
      validityItem.insufficient_validity,
      validityItem.insufficientValidity
    );
    const level = noValidAnswers ? null : getLevelByScore(averageScore);
    const dimensionCopy = getNarcissismRiskDimensionCopy(code);
    const levelCopy =
      level && !noValidAnswers ? getNarcissismRiskDimensionCopy(code, level) : null;

    return {
      code,
      name: dimensionCopy?.name ?? dimensionMeta.name ?? code,
      shortName: dimensionCopy?.shortName ?? dimensionMeta.shortName ?? code,
      description: dimensionCopy?.description ?? "",
      averageScore,
      scoreText: averageScore === null ? "-" : `${averageScore.toFixed(2)} / 5`,
      level,
      levelLabel: level ? LEVEL_LABELS[level] : "数据不足",
      validCount: getDimensionCount(detail, validityItem, "valid_count"),
      naCount: getDimensionCount(detail, validityItem, "na_count"),
      insufficientValidity,
      noValidAnswers,
      analysis: noValidAnswers ? validity.dimensionAllNA.reportText : levelCopy?.analysis ?? "",
      suggestion: noValidAnswers ? "" : levelCopy?.suggestion ?? "",
    };
  });
}

function buildRadarData(dimensionSummaries) {
  return dimensionSummaries
    .filter((dimension) => !dimension.noValidAnswers && dimension.averageScore !== null)
    .map((dimension) => ({
      code: dimension.code,
      name: dimension.name,
      shortName: dimension.shortName,
      avg: dimension.averageScore,
    }));
}

function sortScoredDimensions(dimensionSummaries) {
  const orderIndex = new Map(
    NARCISSISM_RISK_DIMENSION_ORDER.map((code, index) => [code, index])
  );

  return dimensionSummaries
    .filter((item) => item.level && item.averageScore !== null && !item.noValidAnswers)
    .sort(
      (left, right) =>
        right.averageScore - left.averageScore ||
        (orderIndex.get(left.code) ?? 0) - (orderIndex.get(right.code) ?? 0)
    );
}

function pickModerateFocusDimensions(sortedDimensions) {
  const moderateDimensions = sortedDimensions.filter(
    (dimension) => dimension.level === "moderate"
  );
  if (moderateDimensions.length <= 2) return moderateDimensions;

  const secondScore = moderateDimensions[1]?.averageScore;
  return moderateDimensions.filter(
    (dimension, index) => index < 2 || dimension.averageScore === secondScore
  );
}

function buildFocusDimensionSummary(dimensionSummaries) {
  const sortedDimensions = sortScoredDimensions(dimensionSummaries);
  const highRiskDimensions = sortedDimensions.filter(
    (dimension) => dimension.level === "high"
  );
  const moderateDimensions = sortedDimensions.filter(
    (dimension) => dimension.level === "moderate"
  );

  let title = null;
  let dimensions = [];
  let fallbackText = "";

  if (highRiskDimensions.length >= 3) {
    title = focusDimensionRules.highRiskThreeOrMore.title;
    dimensions = highRiskDimensions;
  } else if (highRiskDimensions.length >= 1) {
    title = focusDimensionRules.highRiskOneOrTwo.title;
    dimensions = highRiskDimensions;
  } else if (moderateDimensions.length >= 2) {
    title = focusDimensionRules.moderateTwoOrMoreWithoutHighRisk.title;
    dimensions = pickModerateFocusDimensions(sortedDimensions);
  } else if (moderateDimensions.length === 1) {
    title = focusDimensionRules.moderateSingleWithoutHighRisk.title;
    dimensions = moderateDimensions;
  } else {
    title = focusDimensionRules.noFocusedRiskDimension.title;
    fallbackText = focusDimensionRules.noFocusedRiskDimension.fallbackText;
  }

  const closeScoreNotice = focusDimensionRules.closeScoreNotice;
  const comparableDimensions = sortedDimensions.filter((dimension) =>
    closeScoreNotice.applicableLevels.includes(dimension.level)
  );
  const notice =
    comparableDimensions.length >= closeScoreNotice.minDimensionCount &&
    comparableDimensions[0].averageScore -
      comparableDimensions[closeScoreNotice.minDimensionCount - 1].averageScore <=
      closeScoreNotice.maxScoreGap
      ? closeScoreNotice.text
      : "";

  return {
    title,
    dimensions: dimensions.map((dimension) => ({
      code: dimension.code,
      name: dimension.name,
      shortName: dimension.shortName,
      averageScore: dimension.averageScore,
      level: dimension.level,
      levelLabel: dimension.levelLabel,
    })),
    fallbackText,
    notice,
  };
}

function getHighRiskItemsFromPayload(payload) {
  return normalizeArray(payload.high_risk_items ?? payload.high_risk_triggers)
    .map((item) => normalizeQuestionId(item))
    .filter((questionId) => HIGH_RISK_QUESTION_IDS.has(questionId));
}

function getFallbackHighRiskItems(answerMap) {
  return NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS.filter((questionId) => {
    const rawScore = getAnswerRawScore(answerMap[questionId]);
    return typeof rawScore === "number"
      ? rawScore >= 4
      : Number(rawScore) >= 4;
  });
}

function buildHighRiskTriggerDetails(record, payload) {
  const answerMap = normalizeAnswerMap(record?.answers ?? payload.answers);
  const payloadItems = getHighRiskItemsFromPayload(payload);
  const questionIds =
    payloadItems.length > 0 ? payloadItems : getFallbackHighRiskItems(answerMap);

  return questionIds.map((questionId) => {
    const question = NARCISSISM_RISK_QUESTION_MAP[questionId] ?? {};
    const answer = answerMap[questionId];
    const rawScore = getAnswerRawScore(answer);
    const copy = getNarcissismRiskTriggerCopy(questionId);

    return {
      key: questionId,
      questionId,
      questionNo: question.question_no ?? copy?.questionNo ?? "",
      questionText: question.question_text ?? copy?.questionText ?? "",
      rawScore: toNumberOrNull(rawScore),
      score: getAnswerScore(answer),
      choiceLabel: getAnswerChoiceLabel(answer, rawScore),
      copy,
    };
  });
}

function buildHighRiskTriggerSummary(payload, highRiskTriggerDetails) {
  const payloadTriggered = getBooleanValue(payload.high_risk_triggered);
  const triggered = highRiskTriggerDetails.length > 0 || payloadTriggered;

  return {
    triggered,
    label: triggered ? "已触发" : "未触发",
    count: highRiskTriggerDetails.length,
    text: triggered
      ? `已触发 ${highRiskTriggerDetails.length} 个高风险触发题`
      : "高风险触发：未触发",
  };
}

function buildValidityMessages({
  naCount,
  lowEffectiveAnswerWarning,
  dimensionSummaries,
  allNa,
}) {
  const messages = [];

  if (allNa) {
    messages.push({
      key: "allNA",
      title: validity.allNA.title,
      text: validity.allNA.reportText ?? validity.allNA.text,
    });
    return messages;
  }

  if (lowEffectiveAnswerWarning) {
    messages.push({
      key: "totalEffectiveTooLow",
      title: validity.totalEffectiveTooLow.title,
      text: validity.totalEffectiveTooLow.text,
      suggestion: validity.totalEffectiveTooLow.suggestion,
    });
  }

  const lowValidityDimensions = dimensionSummaries.filter(
    (dimension) => dimension.insufficientValidity && !dimension.noValidAnswers
  );
  if (lowValidityDimensions.length > 0) {
    messages.push({
      key: "dimensionEffectiveTooLow",
      title: validity.dimensionEffectiveTooLow.title,
      text: validity.dimensionEffectiveTooLow.reportText,
      dimensions: lowValidityDimensions.map((dimension) => dimension.code),
    });
  }

  const allNaDimensions = dimensionSummaries.filter(
    (dimension) => dimension.noValidAnswers
  );
  if (allNaDimensions.length > 0) {
    messages.push({
      key: "dimensionAllNA",
      title: validity.dimensionAllNA.title,
      text: validity.dimensionAllNA.reportText,
      dimensions: allNaDimensions.map((dimension) => dimension.code),
    });
  }

  if (naCount > 0) {
    messages.push({
      key: "naBoundary",
      title: validity.naBoundary.title,
      text: validity.naBoundary.text,
    });
  }

  return messages;
}

function buildBoundaryCopy() {
  return {
    admin: reportBoundary.adminReportBoundary,
    diagnostic: reportBoundary.diagnosticBoundary,
    legal: reportBoundary.legalBoundary,
    safety: reportBoundary.safetyBoundary,
    use: reportBoundary.useBoundary,
    recommendedExpressions: reportBoundary.recommendedExpressions ?? [],
    prohibitedExpressions: reportBoundary.prohibitedExpressions ?? [],
  };
}

function sanitizeFilenamePart(value) {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 40);
}

function buildExecutiveSummary({ overallCopy, focusDimensionSummary, highRiskTriggerSummary }) {
  const summary = [];
  if (overallCopy?.meaning) summary.push(overallCopy.meaning);
  if (focusDimensionSummary?.dimensions?.length > 0) {
    const names = focusDimensionSummary.dimensions
      .map((dimension) => dimension.shortName || dimension.name)
      .join("、");
    summary.push(`${focusDimensionSummary.title}：${names}。`);
  } else if (focusDimensionSummary?.fallbackText) {
    summary.push(focusDimensionSummary.fallbackText);
  }
  if (highRiskTriggerSummary?.triggered) {
    summary.push("高风险触发题已触发，后续沟通应优先关注现实安全、证据保存和外部支持。");
  }

  return summary;
}

export function buildNarcissismRiskReportData(record = {}) {
  const payload = getPayload(record);
  const dimensionSummaries = buildDimensionSummaries(record, payload);
  const totalAverageScore =
    roundToTwo(payload.average_score) ??
    (() => {
      const totalScore = toNumberOrNull(record.total_score);
      const effectiveCount = toNumberOrNull(payload.valid_answer_count);
      return totalScore !== null && effectiveCount
        ? roundToTwo(totalScore / effectiveCount)
        : null;
    })();
  const effectiveAnswerCount = toNumberOrNull(payload.valid_answer_count) ?? 0;
  const naCount = toNumberOrNull(payload.na_answer_count) ?? 0;
  const allNa = effectiveAnswerCount === 0 && naCount > 0;
  const overallLevel =
    normalizeLevel(record.result_level) ?? getLevelByScore(totalAverageScore);
  const overallCopy = overallLevel ? getNarcissismRiskOverallCopy(overallLevel) : null;
  const lowEffectiveAnswerWarning =
    getBooleanValue(payload.low_validity) ||
    effectiveAnswerCount < NARCISSISM_RISK_LOW_VALID_ANSWER_THRESHOLD;
  const radarData = buildRadarData(dimensionSummaries);
  const focusDimensionSummary = buildFocusDimensionSummary(dimensionSummaries);
  const highRiskTriggerDetails = buildHighRiskTriggerDetails(record, payload);
  const highRiskTriggerSummary = buildHighRiskTriggerSummary(
    payload,
    highRiskTriggerDetails
  );
  const validityMessages = buildValidityMessages({
    naCount,
    lowEffectiveAnswerWarning,
    dimensionSummaries,
    allNa,
  });
  const clientName = record.contact_name || "未填写称呼";
  const exportName = sanitizeFilenamePart(clientName) || "未填写称呼";

  return {
    isRenderable: !allNa,
    degradedReason: allNa ? validity.allNA.reportText : "",
    reportTitle: REPORT_TITLE,
    assessmentType: NARCISSISM_RISK_ASSESSMENT_TYPE,
    clientName,
    submittedAt: record.created_at ?? record.submitted_at ?? "",
    reportGeneratedAt: record.report_generated_at ?? "",
    reportVersion: record.report_version || "v1",
    overallLevel,
    overallLevelLabel:
      overallCopy?.label ?? record.result_label ?? (overallLevel ? LEVEL_LABELS[overallLevel] : "-"),
    overallCopy,
    executiveSummary: buildExecutiveSummary({
      overallCopy,
      focusDimensionSummary,
      highRiskTriggerSummary,
    }),
    totalAverageScore,
    totalAverageScoreText:
      totalAverageScore === null ? "-" : `${totalAverageScore.toFixed(2)} / 5`,
    totalScore: toNumberOrNull(record.total_score),
    dynamicFullScore: toNumberOrNull(record.dynamic_full_score),
    scoreRate: toNumberOrNull(record.score_rate),
    effectiveAnswerCount,
    naCount,
    lowEffectiveAnswerWarning,
    dimensionSummaries,
    radarData,
    focusDimensionSummary,
    highRiskTriggerSummary,
    highRiskTriggerDetails,
    validityMessages,
    boundaryCopy: buildBoundaryCopy(),
    teamIntro: teamIntroContent,
    exportFilenameBase: `配偶高自恋风险详细报告_${exportName}_${record.id ?? "record"}`,
  };
}
