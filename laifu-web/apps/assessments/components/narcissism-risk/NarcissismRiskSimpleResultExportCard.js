import {
  NARCISSISM_RISK_DIMENSION_ORDER,
  NARCISSISM_RISK_DIMENSIONS,
  NARCISSISM_RISK_QUESTION_COUNT,
} from "../../data/narcissismRiskQuestions.js";
import { NARCISSISM_RISK_DISCLAIMER_COPY } from "../../data/narcissismRiskResultCopy.js";
import NarcissismRiskRadarChart from "./NarcissismRiskRadarChart.js";
import styles from "./narcissismRisk.module.css";

function formatScore(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function formatDimensionScore(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function getDimensionRiskLevel(score) {
  if (!Number.isFinite(score)) return "invalid";
  if (score > 3.5) return "high";
  if (score >= 3) return "moderate";
  if (score >= 2) return "mild";
  return "low";
}

function sortDimensionsByScore(dimensions) {
  return [...dimensions].sort(
    (left, right) => right.score - left.score || left.order - right.order
  );
}

function getTopDimensionsWithTies(dimensions, count = 2) {
  const sortedDimensions = sortDimensionsByScore(dimensions);
  if (sortedDimensions.length <= count) return sortedDimensions;

  const cutoffScore = sortedDimensions[count - 1].score;
  return sortedDimensions.filter((item) => item.score >= cutoffScore);
}

function hasCloseDimensionCluster(dimensions) {
  const eligibleDimensions = dimensions
    .filter((item) => ["high", "moderate"].includes(item.level))
    .map((item) => item.score)
    .sort((left, right) => left - right);

  if (eligibleDimensions.length < 3) return false;

  return eligibleDimensions.some((score, index) => {
    const thirdScore = eligibleDimensions[index + 2];
    if (!Number.isFinite(thirdScore)) return false;
    return thirdScore - score <= 0.1 + Number.EPSILON;
  });
}

function buildFocusDimensionSummary(dimensions) {
  const validDimensions = dimensions.filter(
    (item) => !item.detail?.no_valid_answers && Number.isFinite(item.score)
  );
  const highDimensions = sortDimensionsByScore(
    validDimensions.filter((item) => item.level === "high")
  );
  const moderateDimensions = validDimensions.filter(
    (item) => item.level === "moderate"
  );
  const hasCloseCluster = hasCloseDimensionCluster(validDimensions);

  if (highDimensions.length >= 3) {
    return {
      title: "主要风险维度",
      description:
        "以下维度均已进入高风险区间，建议结合具体事件优先梳理。",
      dimensions: highDimensions,
      closeNote: hasCloseCluster
        ? "多个关注维度得分接近，说明风险信号可能不只集中在单一方面，建议结合具体事件整体判断。"
        : "",
    };
  }

  if (highDimensions.length > 0) {
    return {
      title: "主要风险维度",
      description:
        "以下维度已进入高风险区间，其它维度不在此处补足展示。",
      dimensions: highDimensions,
      closeNote: hasCloseCluster
        ? "多个关注维度得分接近，说明风险信号可能不只集中在单一方面，建议结合具体事件整体判断。"
        : "",
    };
  }

  if (moderateDimensions.length >= 2) {
    return {
      title: "相对关注维度",
      description:
        "当前未见高风险维度，以下为中等风险区间中相对更需要关注的维度。",
      dimensions: getTopDimensionsWithTies(moderateDimensions, 2),
      closeNote: hasCloseCluster
        ? "多个关注维度得分接近，说明风险信号可能不只集中在单一方面，建议结合具体事件整体判断。"
        : "",
    };
  }

  if (moderateDimensions.length === 1) {
    return {
      title: "相对关注维度",
      description:
        "当前未见高风险维度，此维度处于中等风险区间，可作为后续观察重点。",
      dimensions: moderateDimensions,
      closeNote: "",
    };
  }

  return {
    title: "暂无明显风险维度",
    description:
      "当前五维均处于低风险或轻度风险区间，暂无需要作为风险维度单独标记的维度。",
    dimensions: [],
    closeNote: "",
  };
}

function getInsufficientDimensionText(dimensionDetails) {
  const affectedDimensions = NARCISSISM_RISK_DIMENSION_ORDER.filter((code) => {
    const detail = dimensionDetails?.[code];
    return detail?.insufficient_validity || detail?.no_valid_answers;
  });

  if (affectedDimensions.length === 0) return "";

  return affectedDimensions
    .map((code) => NARCISSISM_RISK_DIMENSIONS[code]?.shortName)
    .filter(Boolean)
    .join("、");
}

export default function NarcissismRiskSimpleResultExportCard({ scoringResult }) {
  const radarDimensions = NARCISSISM_RISK_DIMENSION_ORDER.map((code) => ({
    code,
    name: NARCISSISM_RISK_DIMENSIONS[code].name,
    shortName: NARCISSISM_RISK_DIMENSIONS[code].shortName,
    score: scoringResult.dimension_scores[code],
    detail: scoringResult.dimension_details?.[code],
  })).map((item, order) => ({
    ...item,
    order,
    level: getDimensionRiskLevel(item.score),
  }));
  const insufficientDimensionText = getInsufficientDimensionText(
    scoringResult.dimension_details
  );
  const focusDimensionSummary = buildFocusDimensionSummary(radarDimensions);

  return (
    <section className={styles.simpleExportCard}>
      <header className={styles.simpleExportHeader}>
        <p className={styles.simpleExportBrand}>Sandra 婚姻家事团队</p>
        <h2>配偶高自恋特质与高冲突婚姻风险自测结果</h2>
        <p>分数越高，代表相关高自恋互动特征与高冲突风险信号越明显。</p>
      </header>

      <div className={styles.simpleExportMetrics}>
        <div>
          <span>风险等级</span>
          <strong>{scoringResult.result_label}</strong>
        </div>
        <div>
          <span>总平均分</span>
          <strong>{formatScore(scoringResult.average_score)} / 5</strong>
        </div>
        <div>
          <span>总分 / 动态满分</span>
          <strong>
            {scoringResult.total_score} / {scoringResult.dynamic_full_score}
          </strong>
        </div>
        <div>
          <span>有效作答数</span>
          <strong>
            {scoringResult.valid_answer_count} / {NARCISSISM_RISK_QUESTION_COUNT}
          </strong>
        </div>
        <div>
          <span>与本人情况无关</span>
          <strong>{scoringResult.na_answer_count}</strong>
        </div>
        <div>
          <span>高风险触发</span>
          <strong>{scoringResult.high_risk_triggered ? "是" : "否"}</strong>
        </div>
      </div>

      <div className={styles.simpleExportReportStack}>
        <div className={styles.simpleExportRadarBlock}>
          <h3>五维雷达图</h3>
          <NarcissismRiskRadarChart dimensions={radarDimensions} />
        </div>

        <div className={styles.simpleExportFocusBlock}>
          <h3>{focusDimensionSummary.title}</h3>
          <p>{focusDimensionSummary.description}</p>

          {focusDimensionSummary.dimensions.length > 0 && (
            <div className={styles.simpleExportFocusList} role="list">
              {focusDimensionSummary.dimensions.map((dimension) => (
                <div key={dimension.code} className={styles.simpleExportFocusItem} role="listitem">
                  <span>{dimension.name}</span>
                  <strong>均分 {formatDimensionScore(dimension.score)}</strong>
                </div>
              ))}
            </div>
          )}

          {focusDimensionSummary.closeNote && (
            <div className={styles.simpleExportCloseNote}>
              {focusDimensionSummary.closeNote}
            </div>
          )}
        </div>

        <div className={styles.simpleExportSummaryBlock}>
          {scoringResult.low_validity && (
            <div className={styles.simpleExportNotice}>
              有效作答较少，结果参考性有限。
            </div>
          )}

          {insufficientDimensionText && (
            <div className={styles.simpleExportNotice}>
              维度有效作答不足：{insufficientDimensionText}
            </div>
          )}

          <div
            className={`${styles.simpleExportSafety} ${
              scoringResult.high_risk_triggered
                ? styles.simpleExportSafetyStrong
                : ""
            }`}
          >
            {scoringResult.high_risk_triggered
              ? "已出现需要优先关注的安全风险信号。建议优先保护自身及孩子安全，保存关键证据，并在必要时寻求现实支持或专业帮助。"
              : "暂未触发最高优先级安全题，但仍应结合现实情况判断风险。"}
          </div>
        </div>
      </div>

      <footer className={styles.simpleExportFooter}>
        <p>{NARCISSISM_RISK_DISCLAIMER_COPY.exportImage}</p>
        <strong>法愈人生，帮你找到适合自己的方式。</strong>
      </footer>
    </section>
  );
}
