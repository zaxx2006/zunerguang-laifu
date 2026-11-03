import { formatRate } from "../lib/scoring.js";
import DimensionRadarChart from "./DimensionRadarChart.js";

const BRIDGE_TEXT_BY_LEVEL = {
    high: "建议在正式推进前，再确认关键安排与节奏。",
    mid: "建议先补强关键短板，再判断更稳妥的推进顺序。",
    low: "建议优先梳理风险点与准备方向，再决定后续安排。",
};

export default function SimpleResultExportCard({ resultData }) {
    const bridgeText = BRIDGE_TEXT_BY_LEVEL[resultData.levelKey] ?? BRIDGE_TEXT_BY_LEVEL.mid;

    return (
        <section className={`export-card theme-${resultData.levelKey}`}>
            <header className="export-head">
                <p className="export-title">离婚准备评估结果</p>
                <h3>{resultData.level.label}</h3>
                <p className="export-bridge">{bridgeText}</p>
            </header>

            <div className="export-metrics">
                <div className="export-metric-item">
                    <span>得分率</span>
                    <strong>{formatRate(resultData.scoreRate)}</strong>
                </div>
                <div className="export-metric-item">
                    <span>总分</span>
                    <strong>{resultData.totalScore}</strong>
                </div>
                <div className="export-metric-item">
                    <span>动态满分</span>
                    <strong>{resultData.dynamicFullScore}</strong>
                </div>
            </div>

            <div className="export-radar-block">
                <h4>维度雷达图</h4>
                <DimensionRadarChart dimensions={resultData.radarDimensions} />
            </div>

            <div className="export-weakness-block">
                <h4>当前优先补强维度</h4>
                <div className="export-weakness-list" role="list">
                    {resultData.weaknesses.map((item) => (
                        <div key={item.code} className="export-weakness-item" role="listitem">
                            <span>{item.name}</span>
                            <strong>均分 {item.avg.toFixed(1)}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
