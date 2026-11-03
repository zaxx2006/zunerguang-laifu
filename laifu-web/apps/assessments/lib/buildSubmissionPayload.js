const DIVORCE_READINESS_ASSESSMENT_TYPE = "divorce_readiness";

export const DIVORCE_READINESS_SERVICE_INTENT_OPTIONS = [
  { value: "legal_support", label: "需要法律支持" },
  { value: "psychological_support", label: "需要心理支持" },
  { value: "deep_report", label: "仅需深度报告" },
];

export function resolveDivorceReadinessServiceIntent(value) {
  const matchedIntent = DIVORCE_READINESS_SERVICE_INTENT_OPTIONS.find(
    (item) => item.value === value
  );

  return matchedIntent ?? null;
}

export function buildSubmissionPayload({
  answers,
  resultData,
  serviceIntent,
  submittedAt = new Date().toISOString(),
}) {
  const childGateAnswer = answers.SYS_CHILD_GATE ?? null;
  const crossBorderGateAnswer = answers.SYS_CROSS_BORDER_GATE ?? null;
  const resolvedServiceIntent =
    resolveDivorceReadinessServiceIntent(serviceIntent);

  if (!resolvedServiceIntent) {
    throw new Error("buildSubmissionPayload requires a valid serviceIntent.");
  }

  const weaknesses = (resultData.weaknesses || []).map((item) => item.code);
  const dimensionScores = resultData.dimensionScores || {};
  const scoreRate = Number(resultData.scoreRate.toFixed(1));
  const submissionSource = "web";

  return {
    submittedAt,
    assessmentType: DIVORCE_READINESS_ASSESSMENT_TYPE,
    serviceIntent: resolvedServiceIntent.value,
    serviceIntentLabel: resolvedServiceIntent.label,
    totalScore: resultData.totalScore,
    dynamicFullScore: resultData.dynamicFullScore,
    scoreRate,
    resultLevel: resultData.levelKey,
    resultLabel: resultData.level.label,
    childGateAnswer,
    crossBorderGateAnswer,
    weaknesses,
    dimensionScores,
    answers,
    submissionSource,
    resultPayload: {
      assessment_type: DIVORCE_READINESS_ASSESSMENT_TYPE,
      service_intent: resolvedServiceIntent.value,
      service_intent_label: resolvedServiceIntent.label,
      total_score: resultData.totalScore,
      dynamic_full_score: resultData.dynamicFullScore,
      score_rate: scoreRate,
      result_level: resultData.levelKey,
      result_label: resultData.level.label,
      result_subtitle: resultData.level.subtitle,
      dimension_scores: dimensionScores,
      radar_dimensions: resultData.radarDimensions || [],
      weaknesses: resultData.weaknesses || [],
      answers,
      child_gate_answer: childGateAnswer,
      cross_border_gate_answer: crossBorderGateAnswer,
      is_cross_border_marriage: Boolean(resultData.isCrossBorderMarriage),
      submission_source: submissionSource,
    },
  };
}
