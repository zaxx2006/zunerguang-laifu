import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  isAuthorizedSessionValue,
} from "../../../../lib/auth";
import {
  getLeadDetail,
  markLeadReportPreviewGenerated,
} from "../../../../lib/leadDetail";
import { calculateDimensionScoresFromAnswers } from "../../../../lib/assessmentDisplay";
import {
  formatDateTime,
  formatGateAnswer,
  formatScoreRate,
} from "../../../../lib/format";
import LeadReportPage from "../../../../components/LeadReportPage";
import {
  getIncludedDimensionCodes,
  getReportScoreBand,
  getTotalResultCopy,
  REPORT_DIMENSION_COPY,
} from "../../../../lib/reportContent";
import {
  getAssessmentTypeLabel,
  isDivorceReadinessRecord,
  isNarcissismRiskRecord,
} from "../../../../lib/leadAssessment";
import { buildNarcissismRiskReportData } from "../../../../lib/narcissismRiskReportAdapter";
import NarcissismRiskReportPage from "../../../../components/narcissism-risk/NarcissismRiskReportPage";

export const dynamic = "force-dynamic";

function buildReportDimensions(row) {
  const dbScores =
    row.dimension_scores &&
    typeof row.dimension_scores === "object" &&
    !Array.isArray(row.dimension_scores)
      ? row.dimension_scores
      : {};
  const fallbackScores =
    Object.keys(dbScores).length > 0
      ? {}
      : calculateDimensionScoresFromAnswers(row.answers);
  const scores = Object.keys(dbScores).length > 0 ? dbScores : fallbackScores;

  return getIncludedDimensionCodes({
    childGateAnswer: row.child_gate_answer,
    crossBorderGateAnswer: row.cross_border_gate_answer,
  })
    .map((code) => {
      const avg = Number(scores[code]);
      const copy = REPORT_DIMENSION_COPY[code];
      if (!copy || !Number.isFinite(avg)) return null;

      const band = getReportScoreBand(avg);
      return {
        code,
        name: copy.name,
        shortName: copy.shortName,
        avg: Number(avg.toFixed(2)),
        functionText: copy.functionText,
        analysis: copy.bands[band].analysis,
        advice: copy.bands[band].advice,
      };
    })
    .filter(Boolean);
}

function buildReportStatusText(row) {
  return row.report_generated_at ? "可预览" : "未生成";
}

function UnsupportedReportNotice({ row }) {
  const isNarcissismRisk = isNarcissismRiskRecord(row);
  const assessmentTypeLabel = isNarcissismRisk
    ? "配偶高自恋特质与高冲突婚姻风险自测量表"
    : getAssessmentTypeLabel(row);

  return (
    <main className="page">
      <div className="container">
        <section className="panel">
          <div className="title-row">
            <div>
              <h1 className="title">暂不生成离婚力量表详细报告</h1>
              <p className="subtitle">
                {isNarcissismRisk
                  ? "该记录来自“配偶高自恋特质与高冲突婚姻风险自测量表”。该量表的后台详细报告将在第二阶段接入，当前暂不生成离婚力量表详细报告。"
                  : `该记录来自“${assessmentTypeLabel}”。当前暂未接入该类型的后台详细报告，未生成离婚力量表详细报告。`}
              </p>
            </div>
            <div className="toolbar">
              <Link className="btn btn-muted" href={`/leads/${row.id}`}>
                返回详情页
              </Link>
              <Link className="btn btn-ghost" href="/leads">
                返回列表
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default async function LeadReportRoute({ params }) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAuthorizedSessionValue(sessionValue)) {
    redirect("/login");
  }

  const resolvedParams =
    params && typeof params.then === "function" ? await params : params ?? {};
  const id = resolvedParams.id;

  const { row, error } = await getLeadDetail(id);

  if (error || !row) {
    return (
      <main className="page">
        <div className="container">
          <section className="panel">
            <div className="title-row">
              <div>
                <h1 className="title">未找到详细报告</h1>
                <p className="subtitle">该记录不存在，或当前无法读取该条报告数据。</p>
              </div>
              <Link className="btn btn-muted" href="/leads">
                返回列表
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (isNarcissismRiskRecord(row)) {
    const writeBackResult = await markLeadReportPreviewGenerated(row.id);
    const effectiveRow = writeBackResult.row ?? row;
    const report = buildNarcissismRiskReportData(effectiveRow);

    return (
      <main className="page">
        <div className="container detail-container">
          <section className="panel">
            <div className="title-row">
              <div>
                <h1 className="title">配偶高自恋风险测评详细解读报告</h1>
                <p className="subtitle">
                  后台单条记录的完整预览页，当前报告不做持久化，不开放用户端访问。
                </p>
              </div>
              <div className="toolbar">
                <Link className="btn btn-muted" href={`/leads/${effectiveRow.id}`}>
                  返回详情页
                </Link>
                <Link className="btn btn-ghost" href="/leads">
                  返回列表
                </Link>
              </div>
            </div>

            {writeBackResult.error ? (
              <div className="notice error">
                报告页已打开，但本次未成功写回报告生成时间，请稍后重试。
              </div>
            ) : (
              <div className="notice success">
                已按当前路径写回报告生成时间
                {effectiveRow.report_version ? `，当前版本为 ${effectiveRow.report_version}` : ""}。
              </div>
            )}
          </section>

          <NarcissismRiskReportPage report={report} />
        </div>
      </main>
    );
  }

  if (!isDivorceReadinessRecord(row)) {
    return <UnsupportedReportNotice row={row} />;
  }

  const writeBackResult = await markLeadReportPreviewGenerated(row.id);
  const effectiveRow = writeBackResult.row ?? row;
  const reportDimensions = buildReportDimensions(effectiveRow);
  const totalResult = getTotalResultCopy({
    resultLevel: effectiveRow.result_level,
    crossBorder:
      effectiveRow.cross_border_gate_answer === true ||
      effectiveRow.cross_border_gate_answer === "yes",
  });

  const report = {
    id: effectiveRow.id,
    contactName: effectiveRow.contact_name || "未填写姓名",
    totalScore: effectiveRow.total_score ?? "-",
    dynamicFullScore: effectiveRow.dynamic_full_score ?? "-",
    scoreRateText: formatScoreRate(effectiveRow.score_rate),
    reportVersion: effectiveRow.report_version || "v1",
    reportGeneratedAtText: formatDateTime(effectiveRow.report_generated_at),
    resultLevel: effectiveRow.result_level,
    totalResult,
    dimensions: reportDimensions,
  };

  return (
    <main className="page">
      <div className="container detail-container">
        <section className="panel">
          <div className="title-row">
            <div>
              <h1 className="title">用户测评详细解读报告</h1>
              <p className="subtitle">
                后台单条记录的完整预览页，当前口径下进入页面即轻量写回报告生成时间与默认版本。
              </p>
            </div>
            <div className="toolbar">
              <Link className="btn btn-muted" href={`/leads/${effectiveRow.id}`}>
                返回详情页
              </Link>
              <Link className="btn btn-ghost" href="/leads">
                返回列表
              </Link>
            </div>
          </div>

          {writeBackResult.error ? (
            <div className="notice error">
              报告页面已打开，但本次未成功写回报告生成时间，请稍后重试。
            </div>
          ) : (
            <div className="notice success">
              已按当前口径写回报告生成时间
              {effectiveRow.report_version ? `，当前版本为 ${effectiveRow.report_version}` : ""}。
            </div>
          )}

          <div className="info-grid">
            <div className="info-item">
              <span>用户称呼</span>
              <strong>{effectiveRow.contact_name || "-"}</strong>
            </div>
            <div className="info-item">
              <span>报告状态</span>
              <strong>{buildReportStatusText(effectiveRow)}</strong>
            </div>
            <div className="info-item">
              <span>报告版本</span>
              <strong>{effectiveRow.report_version || "v1"}</strong>
            </div>
            <div className="info-item">
              <span>报告生成时间</span>
              <strong>{formatDateTime(effectiveRow.report_generated_at)}</strong>
            </div>
            <div className="info-item">
              <span>纳入报告维度</span>
              <strong>{reportDimensions.map((item) => item.code).join("、") || "-"}</strong>
            </div>
            <div className="info-item">
              <span>子女分流</span>
              <strong>{formatGateAnswer(effectiveRow.child_gate_answer)}</strong>
            </div>
            <div className="info-item">
              <span>跨境分流</span>
              <strong>{formatGateAnswer(effectiveRow.cross_border_gate_answer)}</strong>
            </div>
          </div>
        </section>

        <LeadReportPage report={report} />
      </div>
    </main>
  );
}
