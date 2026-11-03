import {
  NARCISSISM_RISK_ASSESSMENT_TYPE,
  NARCISSISM_RISK_DIMENSION_ORDER,
} from "../data/narcissismRiskQuestions.js";
import {
  calculateNarcissismRiskResult,
  getNarcissismRiskPrimaryDimensions,
  normalizeNarcissismRiskAnswers,
  normalizeNarcissismRiskQuestionOrder,
} from "./narcissismRiskScoring.js";

function cleanContactValue(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export const NARCISSISM_RISK_SERVICE_INTENT_OPTIONS = [
  { value: "legal_support", label: "需要法律支持" },
  { value: "psychological_support", label: "需要心理支持" },
  { value: "deep_report", label: "仅需深度报告" },
];

export function resolveNarcissismRiskServiceIntent(value) {
  const matchedIntent = NARCISSISM_RISK_SERVICE_INTENT_OPTIONS.find(
    (item) => item.value === value
  );

  return matchedIntent ?? null;
}

function resolveContact(contact = {}) {
  return {
    contact_name: cleanContactValue(contact.contact_name ?? contact.name),
    contact_phone: cleanContactValue(contact.contact_phone ?? contact.phone),
    contact_wechat: cleanContactValue(contact.contact_wechat ?? contact.wechat),
  };
}

function resolveScoringResult({ scoringResult, answers, questionOrder }) {
  if (scoringResult) return scoringResult;

  if (!answers) {
    throw new Error(
      "buildNarcissismRiskSubmissionPayload requires scoringResult or answers."
    );
  }

  return calculateNarcissismRiskResult(answers, questionOrder);
}

function hasCompleteScoringResult(result) {
  return Boolean(
    result?.answers &&
      result?.dimension_details &&
      result?.valid_answer_count !== undefined &&
      result?.na_answer_count !== undefined
  );
}

function buildDimensionValidity(dimensionDetails) {
  return Object.fromEntries(
    NARCISSISM_RISK_DIMENSION_ORDER.map((code) => {
      const detail = dimensionDetails?.[code] ?? {};
      return [
        code,
        {
          valid_count: detail.valid_count ?? 0,
          na_count: detail.na_count ?? 0,
          insufficient_validity: Boolean(detail.insufficient_validity),
          no_valid_answers: Boolean(detail.no_valid_answers),
        },
      ];
    })
  );
}

export function buildNarcissismRiskSubmissionPayload({
  scoringResult,
  contact = {},
  serviceIntent,
  answers,
  questionOrder,
} = {}) {
  const initialResult = resolveScoringResult({ scoringResult, answers, questionOrder });
  const contactPayload = resolveContact(contact);
  const resolvedServiceIntent = resolveNarcissismRiskServiceIntent(serviceIntent);

  if (!resolvedServiceIntent) {
    throw new Error(
      "buildNarcissismRiskSubmissionPayload requires a valid serviceIntent."
    );
  }

  const initialAnswers =
    initialResult.answers ?? normalizeNarcissismRiskAnswers(answers);
  const normalizedQuestionOrder = normalizeNarcissismRiskQuestionOrder(
    initialResult.question_order ?? questionOrder
  );
  const result = hasCompleteScoringResult(initialResult)
    ? initialResult
    : calculateNarcissismRiskResult(initialAnswers, normalizedQuestionOrder);
  const normalizedAnswers = result.answers ?? initialAnswers;
  const primaryRiskDimensions =
    result.primary_risk_dimensions?.length > 0
      ? result.primary_risk_dimensions
      : getNarcissismRiskPrimaryDimensions(
          result.dimension_scores,
          result.dimension_details
        );
  const dimensionValidity = buildDimensionValidity(result.dimension_details);

  return {
    assessment_type: NARCISSISM_RISK_ASSESSMENT_TYPE,
    total_score: result.total_score,
    dynamic_full_score: result.dynamic_full_score,
    score_rate: result.score_rate,
    result_level: result.result_level,
    result_label: result.result_label,
    dimension_scores: result.dimension_scores,
    answers: normalizedAnswers,
    contact_name: contactPayload.contact_name,
    contact_phone: contactPayload.contact_phone,
    contact_wechat: contactPayload.contact_wechat,
    service_intent: resolvedServiceIntent.value,
    submission_source: "narcissism_risk_web",
    follow_up_status: "new",
    result_payload: {
      service_intent: resolvedServiceIntent.value,
      service_intent_label: resolvedServiceIntent.label,
      average_score: result.average_score,
      score_direction: "higher_is_riskier",
      valid_answer_count: result.valid_answer_count,
      na_answer_count: result.na_answer_count,
      low_validity: Boolean(result.low_validity),
      dimension_validity: dimensionValidity,
      dimension_details: result.dimension_details,
      high_risk_triggered: Boolean(result.high_risk_triggered),
      high_risk_items: [...(result.high_risk_items ?? [])],
      primary_risk_dimensions: [...primaryRiskDimensions],
      question_order: normalizedQuestionOrder,
    },
  };
}
