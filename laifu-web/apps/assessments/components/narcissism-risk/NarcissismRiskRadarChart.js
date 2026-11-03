import styles from "./narcissismRisk.module.css";

const MAX_SCORE = 5;
const CHART_SIZE = 360;
const CENTER = CHART_SIZE / 2;
const MAX_RADIUS = 112;
const LABEL_RADIUS = 142;
const GRID_LEVELS = [0.2, 0.4, 0.6, 0.8, 1];
const RADAR_GRID_COLOR = "var(--color-hairline)";
const RADAR_AREA_COLOR = "var(--color-primary)";
const RADAR_STROKE_COLOR = "var(--color-primary)";
const RADAR_LABEL_COLOR = "var(--color-body)";

function getPointByRatio(angle, ratio) {
  const radius = MAX_RADIUS * ratio;
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  };
}

function getLabelPoint(angle) {
  return {
    x: CENTER + Math.cos(angle) * LABEL_RADIUS,
    y: CENTER + Math.sin(angle) * LABEL_RADIUS,
  };
}

function getPolygonPoints(angles, ratio) {
  return angles
    .map((angle) => {
      const point = getPointByRatio(angle, ratio);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export default function NarcissismRiskRadarChart({ dimensions = [] }) {
  const safeDimensions = dimensions.filter((item) => Number.isFinite(item.score));

  if (safeDimensions.length < 3) {
    return <p className={styles.radarEmpty}>维度数据不足，暂不绘制雷达图。</p>;
  }

  const step = (Math.PI * 2) / safeDimensions.length;
  const angles = safeDimensions.map((_, index) => -Math.PI / 2 + step * index);

  const dataPoints = safeDimensions.map((item, index) => {
    const normalized = Math.max(0, Math.min(MAX_SCORE, item.score)) / MAX_SCORE;
    return getPointByRatio(angles[index], normalized);
  });
  const areaPoints = dataPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className={styles.radarChartWrap}>
      <div
        className={styles.radarCanvas}
        role="img"
        aria-label="配偶高自恋特质与高冲突婚姻风险五维雷达图"
      >
        <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
          {GRID_LEVELS.map((level) => (
            <polygon
              key={level}
              className={styles.radarGrid}
              points={getPolygonPoints(angles, level)}
              fill="none"
              stroke={RADAR_GRID_COLOR}
              strokeWidth="1"
            />
          ))}

          {angles.map((angle) => {
            const end = getPointByRatio(angle, 1);
            return (
              <line
                key={angle}
                className={styles.radarAxis}
                x1={CENTER}
                y1={CENTER}
                x2={end.x}
                y2={end.y}
                stroke={RADAR_GRID_COLOR}
                strokeWidth="1"
              />
            );
          })}

          <polygon
            className={styles.radarArea}
            points={areaPoints}
            fill={RADAR_AREA_COLOR}
            fillOpacity="1"
            stroke={RADAR_STROKE_COLOR}
            strokeWidth="2"
          />

          {dataPoints.map((point) => (
            <circle
              key={`${point.x}-${point.y}`}
              className={styles.radarPoint}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={RADAR_STROKE_COLOR}
            />
          ))}

          {safeDimensions.map((item, index) => {
            const labelPoint = getLabelPoint(angles[index]);
            return (
              <text
                key={`${item.code}-label`}
                className={styles.radarLabel}
                x={labelPoint.x}
                y={labelPoint.y}
                fill={RADAR_LABEL_COLOR}
                fontSize="13"
                fontWeight="800"
                fontFamily="var(--font-noto-sans-sc), sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {item.shortName}
              </text>
            );
          })}
        </svg>
      </div>

      <div className={styles.radarLegend} role="list">
        {safeDimensions.map((item) => (
          <div
            key={item.code}
            role="listitem"
            className={`${styles.radarLegendItem} ${
              item.detail?.no_valid_answers || item.detail?.insufficient_validity
                ? styles.radarLegendItemMuted
                : ""
            }`}
          >
            <span className={styles.radarShortName}>{item.shortName}</span>
            <span className={styles.radarLongName}>
              {item.code} · {item.name}
            </span>
            {item.detail?.no_valid_answers && (
              <span className={styles.radarValidityTag}>有效不足</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
