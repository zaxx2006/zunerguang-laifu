import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getFollowUpStatusLabel,
} from "../../../lib/constants";
import {
  formatArrayValue,
  formatDateTime,
  formatGateAnswer,
  formatScoreRate,
  formatServiceTypes,
} from "../../../lib/format";
import {
  ADMIN_SESSION_COOKIE,
  getAdminCredentials,
  isAuthorizedSessionValue,
} from "../../../lib/auth";
import { getLeadDetail, updateLeadDetail } from "../../../lib/leadDetail";
import {
  ANSWER_DISPLAY_ORDER,
  LIKERT_LABELS,
  QUESTION_DISPLAY_MAP,
  calculateDimensionScoresFromAnswers,
  getDisplayScore,
} from "../../../lib/assessmentDisplay";
import LeadDetailForm from "../../../components/LeadDetailForm";
import {
  formatNarcissismAverageScore,
  formatNarcissismHighRiskStatus,
  formatNarcissismLowValidity,
  getAssessmentTypeLabel,
  getLeadServiceIntentLabel,
  getNarcissismAnswerRows,
  getNarcissismDimensionRows,
  getNarcissismHighRiskTriggered,
  getNarcissismHighRiskTriggers,
  getNarcissismNaAnswerCount,
  getNarcissismResultLevelLabel,
  getNarcissismValidAnswerCount,
  getNarcissismLowValidity,
  isDivorceReadinessRecord,
  isNarcissismRiskRecord,
} from "../../../lib/leadAssessment";

export const dynamic = "force-dynamic";

const DIMENSION_LABELS = {
  D1: "D1 心理准备",
  D2: "D2 经济准备",
  D3: "D3 亲权准备",
  D4: "D4 财权准备",
  D5: "D5 法律认知",
  D6: "D6 情感支持",
  D7: "D7 跨境准备",
};

async function saveLeadDetailAction(id, formData) {
  "use server";

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAuthorizedSessionValue(sessionValue)) {
    redirect(`/login?from=/leads/${id}`);
  }

  const operatorName = getAdminCredentials().username || "admin_mvp";
  const { error } = await updateLeadDetail(id, formData, operatorName);

  if (error) {
    redirect(`/leads/${id}?error=save_failed`);
  }

  redirect(`/leads/${id}?saved=1`);
}

function InfoItem({ label, value }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : value;

  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{displayValue}</strong>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="panel detail-section">
      <div className="section-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function DimensionScores({ value, answers }) {
  const dbScores =
    value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const hasDbScores = Object.keys(dbScores).length > 0;
  const fallbackScores = hasDbScores
    ? {}
    : calculateDimensionScoresFromAnswers(answers);
  const scores = hasDbScores ? dbScores : fallbackScores;
  const hasScores = Object.keys(scores).length > 0;
  const entries = Object.keys(DIMENSION_LABELS).map((key) => [
    key,
    scores[key],
  ]);

  return (
    <>
      {hasDbScores ? (
        null
      ) : hasScores ? (
        null
      ) : (
        <div className="notice soft">
          当前记录未写入维度平均分，且原始答案不足以补算。下方仍可查看已记录的原始答案。
        </div>
      )}
      <div className="dimension-list">
        {entries.map(([key, score]) => (
          <div className="dimension-row" key={key}>
            <span>{DIMENSION_LABELS[key] ?? key}</span>
            <strong>{score ?? "未记录"}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

function normalizeAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];

  const orderedIds = [
    ...ANSWER_DISPLAY_ORDER.filter((questionId) =>
      Object.prototype.hasOwnProperty.call(value, questionId)
    ),
    ...Object.keys(value).filter(
      (questionId) => !ANSWER_DISPLAY_ORDER.includes(questionId)
    ),
  ];

  return orderedIds.map((questionId) => {
    const answer = value[questionId];
    const question = QUESTION_DISPLAY_MAP[questionId];
    const isSystemQuestion = Boolean(question?.system);
    const optionLabel = isSystemQuestion
      ? formatGateAnswer(answer)
      : LIKERT_LABELS.get(answer) ?? String(answer ?? "-");
    const score = isSystemQuestion
      ? "不计分"
      : getDisplayScore(answer, question?.reverse);

    return {
      questionId,
      dimension: question?.dimension
        ? DIMENSION_LABELS[question.dimension] ?? question.dimension
        : "系统分流",
      text: question?.text ?? "题干未匹配，请核对题库版本。",
      optionLabel,
      score: score === null || score === undefined ? "-" : score,
    };
  });
}

function AnswersTable({ answers }) {
  const rows = normalizeAnswers(answers);

  if (!rows.length) {
    return <p className="empty">暂无原始答案。</p>;
  }

  return (
    <div className="answers-wrap">
      <table className="answers-table">
        <thead>
          <tr>
            <th>题目编号</th>
            <th>维度 / 类型</th>
            <th>题干</th>
            <th>用户选择</th>
            <th>对应得分</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.questionId}>
              <td>{item.questionId}</td>
              <td>{item.dimension}</td>
              <td>{item.text}</td>
              <td>{item.optionLabel}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDimensionAverage(value) {
  return Number.isFinite(value) ? `${value.toFixed(2)} / 5` : "-";
}

function NarcissismRiskResultSummary({ row }) {
  const lowValidity = getNarcissismLowValidity(row);

  return (
    <Section title="测评结果摘要" description="结果字段优先读取前台写入的 result_payload，后台不重新改判定逻辑。">
      <div className="info-grid">
        <InfoItem
          label="风险等级"
          value={row.result_label || getNarcissismResultLevelLabel(row.result_level)}
        />
        <InfoItem label="result_level" value={row.result_level} />
        <InfoItem label="总平均分" value={formatNarcissismAverageScore(row)} />
        <InfoItem
          label="总分 / 动态满分"
          value={`${row.total_score ?? "-"} / ${row.dynamic_full_score ?? "-"}`}
        />
        <InfoItem label="得分率" value={formatScoreRate(row.score_rate)} />
        <InfoItem label="有效作答数" value={getNarcissismValidAnswerCount(row)} />
        <InfoItem label="NA 数量" value={getNarcissismNaAnswerCount(row)} />
        <InfoItem label="低有效作答" value={formatNarcissismLowValidity(row)} />
        <InfoItem label="高风险触发" value={formatNarcissismHighRiskStatus(row)} />
      </div>
      {lowValidity ? (
        <div className="notice soft">
          当前记录标记为低有效作答，测评结果需要结合实际情况谨慎理解。
        </div>
      ) : null}
    </Section>
  );
}

function NarcissismRiskDimensionScores({ row }) {
  const rows = getNarcissismDimensionRows(row);

  return (
    <div className="dimension-list narcissism-dimension-list">
      {rows.map((item) => (
        <div className="dimension-row narcissism-dimension-row" key={item.code}>
          <span className="narcissism-dimension-title">
            {item.code} {item.name}
          </span>
          <span className="muted">
            短名：{item.shortName || "-"}｜均分：
            <strong>{formatDimensionAverage(item.averageScore)}</strong>
            ｜有效：{item.validCount ?? "-"}｜NA：{item.naCount ?? "-"}
            {item.noValidAnswers
              ? "｜无有效作答"
              : item.insufficientValidity
                ? "｜有效作答不足"
                : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function NarcissismRiskHighRiskTriggers({ row }) {
  const triggered = getNarcissismHighRiskTriggered(row);
  const triggers = getNarcissismHighRiskTriggers(row);

  return (
    <>
      <h3 className="subhead">
        高风险触发题：{triggered ? "已触发" : "未触发"}
      </h3>
      {!triggered ? (
        <p className="empty">未触发高风险安全题。</p>
      ) : triggers.length ? (
        <div className="answers-wrap">
          <table className="answers-table narcissism-trigger-table">
            <thead>
              <tr>
                <th>题号</th>
                <th>题干</th>
                <th>用户选择</th>
                <th>实际计分</th>
              </tr>
            </thead>
            <tbody>
              {triggers.map((item) => (
                <tr key={item.key}>
                  <td>{item.questionNo} / {item.questionId}</td>
                  <td>{item.questionText}</td>
                  <td>{item.choice}</td>
                  <td>{item.score ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="notice soft">
          当前记录标记为已触发，但未写入具体触发题明细。
        </div>
      )}
    </>
  );
}

function NarcissismRiskAnswersTable({ row }) {
  const rows = getNarcissismAnswerRows(row);

  if (!rows.length) {
    return (
      <>
        <h3 className="subhead">原始作答</h3>
        <p className="empty">暂无原始作答。</p>
      </>
    );
  }

  return (
    <>
      <h3 className="subhead">原始作答</h3>
      <div className="answers-wrap">
        <table className="answers-table narcissism-answers-table">
          <thead>
            <tr>
              <th>题号</th>
              <th>维度</th>
              <th>题干</th>
              <th>用户选择</th>
              <th>NA</th>
              <th>反向</th>
              <th>高风险</th>
              <th>计分</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.questionId}>
                <td>{item.questionNo} / {item.questionId}</td>
                <td>{item.dimension}</td>
                <td>{item.questionText}</td>
                <td>{item.choice}</td>
                <td>{item.isNa}</td>
                <td>{item.reverseScored}</td>
                <td>{item.highRiskQuestion}</td>
                <td>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function NarcissismRiskDimensionDetails({ row }) {
  return (
    <Section title="维度详情" description="展示当前记录的维度均分、高风险触发题与原始作答明细。">
      <h3 className="subhead">五维度均分</h3>
      <NarcissismRiskDimensionScores row={row} />

      <NarcissismRiskHighRiskTriggers row={row} />
      <NarcissismRiskAnswersTable row={row} />
    </Section>
  );
}

export default async function LeadDetailPage({ params, searchParams }) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAuthorizedSessionValue(sessionValue)) {
    redirect("/login");
  }

  const resolvedParams =
    params && typeof params.then === "function" ? await params : params ?? {};
  const resolvedSearchParams =
    searchParams && typeof searchParams.then === "function"
      ? await searchParams
      : searchParams ?? {};
  const id = resolvedParams.id;
  const { row, error } = await getLeadDetail(id);

  if (error || !row) {
    return (
      <main className="page">
        <div className="container">
          <section className="panel">
            <div className="title-row">
              <div>
                <h1 className="title">未找到线索</h1>
                <p className="subtitle">
                  该记录不存在，或当前数据库接口查询失败。
                </p>
              </div>
              <Link className="btn btn-muted" href="/leads">
                返回列表
              </Link>
            </div>
            {error ? <div className="error">查询失败：{error.message}</div> : null}
          </section>
        </div>
      </main>
    );
  }

  const saveAction = saveLeadDetailAction.bind(null, row.id);
  const isNarcissismRisk = isNarcissismRiskRecord(row);
  const canOpenLegacyReport = isDivorceReadinessRecord(row);
  const canOpenReport = canOpenLegacyReport || isNarcissismRisk;

  return (
    <main className="page">
      <div className="container detail-container">
        <section className="panel">
          <div className="title-row">
            <div>
              <h1 className="title">
                线索详情：{row.contact_name || "未填写姓名"}
              </h1>
              <p className="subtitle">
                单条记录查看、核心跟进字段编辑与用户测评详细解读报告区入口。
              </p>
            </div>
            <div className="toolbar">
              <Link className="btn btn-muted" href="/leads">
                返回列表
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="btn btn-danger" type="submit">
                  退出登录
                </button>
              </form>
            </div>
          </div>

          {resolvedSearchParams.saved ? (
            <div className="notice success">已保存当前后台编辑信息。</div>
          ) : null}
          {resolvedSearchParams.error ? (
            <div className="notice error">保存失败，请稍后重试或检查字段权限。</div>
          ) : null}
        </section>

        <Section title="基础信息" description="联系方式本轮只读展示，不做纠错编辑。">
          <div className="info-grid">
            <InfoItem label="姓名" value={row.contact_name} />
            <InfoItem label="电话" value={row.contact_phone} />
            <InfoItem label="微信" value={row.contact_wechat} />
            <InfoItem label="提交时间" value={formatDateTime(row.created_at)} />
            <InfoItem label="提交来源" value={row.submission_source} />
            <InfoItem label="量表类型" value={getAssessmentTypeLabel(row)} />
            <InfoItem label="用户服务意向" value={getLeadServiceIntentLabel(row)} />
          </div>
        </Section>

        {isNarcissismRisk ? (
          <>
            <NarcissismRiskResultSummary row={row} />
            <NarcissismRiskDimensionDetails row={row} />
          </>
        ) : (
          <>
            <Section title="测评结果摘要" description="结果字段由前台写入，后台保持只读。">
              <div className="info-grid">
                <InfoItem label="结果等级" value={row.result_label || row.result_level} />
                <InfoItem label="得分率" value={formatScoreRate(row.score_rate)} />
                <InfoItem
                  label="总分 / 动态满分"
                  value={`${row.total_score ?? "-"} / ${row.dynamic_full_score ?? "-"}`}
                />
                <InfoItem label="短板维度" value={formatArrayValue(row.weaknesses)} />
                <InfoItem label="子女分流" value={formatGateAnswer(row.child_gate_answer)} />
                <InfoItem
                  label="跨境分流"
                  value={formatGateAnswer(row.cross_border_gate_answer)}
                />
              </div>
            </Section>

            <Section title="维度详情" description="旧数据缺少维度得分时会显示为空值状态。">
              <h3 className="subhead">维度平均分</h3>
              <DimensionScores value={row.dimension_scores} answers={row.answers} />

              <h3 className="subhead">原始答案</h3>
              <AnswersTable answers={row.answers} />
            </Section>
          </>
        )}

        <LeadDetailForm
          row={row}
          action={saveAction}
          canOpenLegacyReport={canOpenLegacyReport}
          canOpenReport={canOpenReport}
          reportIncludedDimensionText={isNarcissismRisk ? "N1、N2、N3、N4、N5" : ""}
          reportUnavailableMessage={
            "该量表的后台详细报告将在第二阶段接入，当前暂不生成离婚力量表详细报告。"
          }
        />

        <section className="panel">
          <div className="info-grid">
            <InfoItem
              label="当前跟进状态"
              value={getFollowUpStatusLabel(row.follow_up_status)}
            />
            <InfoItem
              label="当前服务类型"
              value={formatServiceTypes(row.service_type)}
            />
            <InfoItem label="线索 ID" value={row.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
