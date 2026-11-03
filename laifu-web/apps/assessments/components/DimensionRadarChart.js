const MAX_SCORE = 5;
const CHART_SIZE = 360;
const CENTER = CHART_SIZE / 2;
const MAX_RADIUS = 112;
const LABEL_RADIUS = 140;
const GRID_LEVELS = [0.2, 0.4, 0.6, 0.8, 1];

const SHORT_LABEL_MAP = {
    D1: "心理",
    D2: "经济",
    D3: "亲权",
    D4: "财权",
    D5: "知法",
    D6: "情感",
    D7: "域外",
};

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

export default function DimensionRadarChart({ dimensions = [] }) {
    const safeDimensions = dimensions.filter((item) => Number.isFinite(item.avg));

    if (safeDimensions.length < 3) {
        return <p className="radar-empty">维度数据不足，暂不绘制雷达图。</p>;
    }

    const step = (Math.PI * 2) / safeDimensions.length;
    const angles = safeDimensions.map((_, index) => -Math.PI / 2 + step * index);

    const dataPoints = safeDimensions.map((item, index) => {
        const normalized = Math.max(0, Math.min(MAX_SCORE, item.avg)) / MAX_SCORE;
        return getPointByRatio(angles[index], normalized);
    });

    const areaPoints = dataPoints.map((point) => `${point.x},${point.y}`).join(" ");

    return (
        <div className="radar-chart-wrap">
            <div className="radar-canvas" role="img" aria-label="结果维度雷达图">
                <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
                    {GRID_LEVELS.map((level) => (
                        <polygon
                            key={level}
                            className="radar-grid"
                            points={getPolygonPoints(angles, level)}
                            fill="none"
                            stroke="var(--color-hairline)"
                            strokeWidth="1"
                        />
                    ))}

                    {angles.map((angle) => {
                        const end = getPointByRatio(angle, 1);
                        return (
                            <line
                                key={angle}
                                className="radar-axis"
                                x1={CENTER}
                                y1={CENTER}
                                x2={end.x}
                                y2={end.y}
                                stroke="var(--color-hairline)"
                                strokeWidth="1"
                            />
                        );
                    })}

                    <polygon
                        className="radar-area"
                        points={areaPoints}
                        fill="var(--color-primary)"
                        fillOpacity="1"
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                    />

                    {dataPoints.map((point) => (
                        <circle
                            key={`${point.x}-${point.y}`}
                            className="radar-point"
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="var(--color-ink)"
                        />
                    ))}

                    {safeDimensions.map((item, index) => {
                        const labelPoint = getLabelPoint(angles[index]);
                        return (
                            <text
                                key={`${item.code}-label`}
                                className="radar-label"
                                x={labelPoint.x}
                                y={labelPoint.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {SHORT_LABEL_MAP[item.code] || item.code}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="radar-legend" role="list">
                {safeDimensions.map((item) => (
                    <div key={item.code} className="radar-legend-item" role="listitem">
                        <span className="radar-legend-short">
                            {SHORT_LABEL_MAP[item.code] || item.code}
                        </span>
                        <span className="radar-legend-name">{item.name}</span>
                        <span className="radar-legend-score">
                            {"均分 "}
                            {item.avg.toFixed(1)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
