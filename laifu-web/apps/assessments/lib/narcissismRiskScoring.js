import {
  NARCISSISM_RISK_ASSESSMENT_TYPE,
  NARCISSISM_RISK_DIMENSION_LOW_VALID_THRESHOLD,
  NARCISSISM_RISK_DIMENSION_ORDER,
  NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS,
  NARCISSISM_RISK_LOW_VALID_ANSWER_THRESHOLD,
  NARCISSISM_RISK_NA_VALUE,
  NARCISSISM_RISK_QUESTION_COUNT,
  NARCISSISM_RISK_QUESTION_MAP,
  NARCISSISM_RISK_QUESTIONS,
} from "../data/narcissismRiskQuestions.js";
import { NARCISSISM_RISK_LEVELS } from "../data/narcissismRiskResultCopy.js";

const VALID_RAW_SCORES = new Set([1, 2, 3, 4, 5]);

function resolveQuestion(question) {
  if (typeof question === "string") {
    const questionConfig = NARCISSISM_RISK_QUESTION_MAP[question];
    if (!questionConfig) {
      throw new Error(`Unknown narcissism risk question id: ${question}`);
    }
    return questionConfig;
  }

  if (question && typeof question === "object" && question.question_id) {
    return question;
  }

  throw new Error("A valid narcissism risk question is required.");
}

function extractRawScore(answerValue, questionId) {
  const value =
    answerValue && typeof answerValue === "object" && !Array.isArray(answerValue)
      ? answerValue.raw_score ?? answerValue.rawScore
      : answerValue;
  let rawScore = value;

  if (typeof value === "string") {
    const normalizedValue = value.trim();
    if (normalizedValue.toLowerCase() === NARCISSISM_RISK_NA_VALUE) {
      return NARCISSISM_RISK_NA_VALUE;
    }
    rawScore = normalizedValue !== "" ? Number(normalizedValue) : value;
  }

  if (!Number.isInteger(rawScore) || !VALID_RAW_SCORES.has(rawScore)) {
    throw new Error(
      `Invalid raw score for ${questionId}. Expected an integer from 1 to 5 or "${NARCISSISM_RISK_NA_VALUE}".`
    );
  }

  return rawScore;
}

function getNarcissismRiskActualScore(question, rawScore) {
  const questionConfig = resolveQuestion(question);
  const normalizedRawScore = extractRawScore(rawScore, questionConfig.question_id);

  if (normalizedRawScore === NARCISSISM_RISK_NA_VALUE) {
    return null;
  }

  return questionConfig.reverse_scored ? 6 - normalizedRawScore : normalizedRawScore;
}

export function normalizeNarcissismRiskAnswers(answers) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new Error("Narcissism risk answers must be an object keyed by question_id.");
  }

  const normalizedAnswers = {};
  const missingQuestionIds = [];

  NARCISSISM_RISK_QUESTIONS.forEach((question) => {
    if (!Object.prototype.hasOwnProperty.call(answers, question.question_id)) {
      missingQuestionIds.push(question.question_id);
      return;
    }

    const rawScore = extractRawScore(answers[question.question_id], question.question_id);
    const isNa = rawScore === NARCISSISM_RISK_NA_VALUE;
    const score = isNa ? null : getNarcissismRiskActualScore(question, rawScore);

    normalizedAnswers[question.question_id] = {
      question_id: question.question_id,
      raw_score: rawScore,
      score,
      is_na: isNa,
      dimension_code: question.dimension_code,
      reverse_scored: question.reverse_scored,
      high_risk_trigger: question.high_risk_trigger,
    };
  });

  if (missingQuestionIds.length > 0) {
    throw new Error(
      `Narcissism risk answers are incomplete. Missing ${missingQuestionIds.length} question(s): ${missingQuestionIds.join(", ")}`
    );
  }

  return normalizedAnswers;
}

export function normalizeNarcissismRiskQuestionOrder(questionOrder) {
  // Later page code should pass the randomized display order; this fallback keeps
  // pure scoring usable for tests and non-random callers.
  if (questionOrder === undefined || questionOrder === null) {
    return NARCISSISM_RISK_QUESTIONS.map((question) => question.question_id);
  }

  if (!Array.isArray(questionOrder)) {
    throw new Error("Narcissism risk questionOrder must be an array.");
  }

  const normalizedQuestionOrder = questionOrder.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") return item.question_id ?? item.id;
    return undefined;
  });

  const invalidQuestionIds = normalizedQuestionOrder.filter(
    (questionId) => !questionId || !NARCISSISM_RISK_QUESTION_MAP[questionId]
  );
  if (invalidQuestionIds.length > 0) {
    throw new Error(
      `Narcissism risk questionOrder contains unknown question id(s): ${invalidQuestionIds.join(", ")}`
    );
  }

  const uniqueQuestionIds = new Set(normalizedQuestionOrder);
  if (
    normalizedQuestionOrder.length !== NARCISSISM_RISK_QUESTION_COUNT ||
    uniqueQuestionIds.size !== NARCISSISM_RISK_QUESTION_COUNT
  ) {
    throw new Error(
      `Narcissism risk questionOrder must contain ${NARCISSISM_RISK_QUESTION_COUNT} unique question ids.`
    );
  }

  return normalizedQuestionOrder;
}

function getNarcissismRiskResultLevel(averageScore) {
  if (!Number.isFinite(averageScore) || averageScore < 1 || averageScore > 5) {
    throw new Error("Narcissism risk averageScore must be a number from 1 to 5.");
  }

  if (averageScore < 2) {
    return NARCISSISM_RISK_LEVELS.find((item) => item.level === "low");
  }
  if (averageScore < 3) {
    return NARCISSISM_RISK_LEVELS.find((item) => item.level === "mild");
  }
  if (averageScore <= 3.5) {
    return NARCISSISM_RISK_LEVELS.find((item) => item.level === "moderate");
  }
  return NARCISSISM_RISK_LEVELS.find((item) => item.level === "high");
}

export function getNarcissismRiskPrimaryDimensions(
  dimensionScores,
  dimensionDetailsOrTopCount = undefined,
  topCount = 2
) {
  if (!dimensionScores || typeof dimensionScores !== "object") {
    throw new Error("Narcissism risk dimensionScores must be an object.");
  }

  const dimensionDetails =
    dimensionDetailsOrTopCount &&
    typeof dimensionDetailsOrTopCount === "object" &&
    !Array.isArray(dimensionDetailsOrTopCount)
      ? dimensionDetailsOrTopCount
      : null;
  const requestedTopCount =
    typeof dimensionDetailsOrTopCount === "number"
      ? dimensionDetailsOrTopCount
      : topCount;
  const normalizedTopCount = Number.isFinite(requestedTopCount)
    ? Math.floor(requestedTopCount)
    : 2;
  const limit = Math.max(
    1,
    Math.min(NARCISSISM_RISK_DIMENSION_ORDER.length, normalizedTopCount)
  );

  return NARCISSISM_RISK_DIMENSION_ORDER.map((code, index) => {
    const score = Number(dimensionScores[code]);
    if (!Number.isFinite(score)) {
      throw new Error(`Missing or invalid narcissism risk dimension score for ${code}.`);
    }

    return {
      code,
      score,
      index,
      noValidAnswers: Boolean(dimensionDetails?.[code]?.no_valid_answers),
    };
  })
    .filter((item) => !item.noValidAnswers)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map((item) => item.code);
}

export function calculateNarcissismRiskResult(answers, questionOrder) {
  const normalizedAnswers = normalizeNarcissismRiskAnswers(answers);
  const normalizedQuestionOrder = normalizeNarcissismRiskQuestionOrder(questionOrder);

  let totalScore = 0;
  const dimensionBuckets = Object.fromEntries(
    NARCISSISM_RISK_DIMENSION_ORDER.map((code) => [
      code,
      {
        totalScore: 0,
        rawTotal: 0,
        validCount: 0,
        naCount: 0,
      },
    ])
  );
  let validAnswerCount = 0;
  let naAnswerCount = 0;

  NARCISSISM_RISK_QUESTIONS.forEach((question) => {
    const answer = normalizedAnswers[question.question_id];

    if (answer.is_na) {
      naAnswerCount += 1;
    } else if (question.included_in_total) {
      totalScore += answer.score;
      validAnswerCount += 1;
    }

    if (question.included_in_dimension_avg) {
      const bucket = dimensionBuckets[question.dimension_code];
      if (answer.is_na) {
        bucket.naCount += 1;
      } else {
        bucket.totalScore += answer.score;
        bucket.rawTotal += answer.raw_score;
        bucket.validCount += 1;
      }
    }
  });

  if (validAnswerCount === 0) {
    throw new Error("有效作答题数为 0，无法生成测评结果。");
  }

  const dynamicFullScore = validAnswerCount * 5;
  const dimensionScores = Object.fromEntries(
    NARCISSISM_RISK_DIMENSION_ORDER.map((code) => {
      const bucket = dimensionBuckets[code];
      const score = bucket.validCount > 0 ? bucket.totalScore / bucket.validCount : 0;
      return [code, score];
    })
  );
  const dimensionDetails = Object.fromEntries(
    NARCISSISM_RISK_DIMENSION_ORDER.map((code) => {
      const bucket = dimensionBuckets[code];
      const score = bucket.validCount > 0 ? bucket.totalScore / bucket.validCount : 0;
      const noValidAnswers = bucket.validCount === 0;

      return [
        code,
        {
          score,
          valid_count: bucket.validCount,
          na_count: bucket.naCount,
          total_score: bucket.totalScore,
          raw_total: bucket.rawTotal,
          dynamic_full_score: bucket.validCount * 5,
          insufficient_validity:
            bucket.validCount < NARCISSISM_RISK_DIMENSION_LOW_VALID_THRESHOLD,
          no_valid_answers: noValidAnswers,
        },
      ];
    })
  );

  const averageScore = totalScore / validAnswerCount;
  const scoreRate = (totalScore / dynamicFullScore) * 100;
  const resultLevel = getNarcissismRiskResultLevel(averageScore);
  const highRiskItems = NARCISSISM_RISK_HIGH_RISK_QUESTION_IDS.filter(
    (questionId) => {
      const rawScore = normalizedAnswers[questionId].raw_score;
      return typeof rawScore === "number" && rawScore >= 4;
    }
  );

  return {
    assessment_type: NARCISSISM_RISK_ASSESSMENT_TYPE,
    total_score: totalScore,
    dynamic_full_score: dynamicFullScore,
    average_score: averageScore,
    score_rate: scoreRate,
    result_level: resultLevel.level,
    result_label: resultLevel.label,
    dimension_scores: dimensionScores,
    dimension_details: dimensionDetails,
    answers: normalizedAnswers,
    valid_answer_count: validAnswerCount,
    na_answer_count: naAnswerCount,
    low_validity:
      validAnswerCount < NARCISSISM_RISK_LOW_VALID_ANSWER_THRESHOLD,
    high_risk_triggered: highRiskItems.length > 0,
    high_risk_items: highRiskItems,
    primary_risk_dimensions: getNarcissismRiskPrimaryDimensions(
      dimensionScores,
      dimensionDetails
    ),
    question_order: normalizedQuestionOrder,
  };
}
