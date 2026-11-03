import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isAuthorizedSessionValue } from "../../../../lib/auth";
import {
  LEADS_EXPORT_LIMIT,
  normalizeLeadFilters,
  queryLeadsForExport,
} from "../../../../lib/leadsQuery";
import {
  formatArrayValue,
  formatDateTime,
  formatGateAnswer,
  formatScoreRate,
  formatServiceTypes,
} from "../../../../lib/format";
import {
  getFollowUpStatusLabel,
  getResultLevelLabel,
} from "../../../../lib/constants";
import {
  formatNarcissismAverageScore,
  formatNarcissismHighRiskStatus,
  formatNarcissismLowValidity,
  getAssessmentTypeLabel,
  getLeadServiceIntentLabel,
  getNarcissismDimensionSummary,
  getNarcissismHighRiskTriggerSummary,
  getNarcissismNaAnswerCount,
  getNarcissismResultLevelLabel,
  getNarcissismValidAnswerCount,
  isNarcissismRiskRecord,
} from "../../../../lib/leadAssessment";

function getLeadResultLabel(row) {
  if (isNarcissismRiskRecord(row)) {
    return row.result_label || getNarcissismResultLevelLabel(row.result_level);
  }
  return row.result_label || getResultLevelLabel(row.result_level);
}

const CSV_COLUMNS = [
  ["提交时间", (row) => formatDateTime(row.created_at)],
  ["量表类型", (row) => getAssessmentTypeLabel(row)],
  ["姓名", (row) => row.contact_name],
  ["电话", (row) => row.contact_phone],
  ["微信", (row) => row.contact_wechat],
  ["用户意向", (row) => getLeadServiceIntentLabel(row)],
  ["结果等级", (row) => getLeadResultLabel(row)],
  ["得分率", (row) => formatScoreRate(row.score_rate)],
  ["新量表总平均分", (row) => formatNarcissismAverageScore(row, "")],
  ["新量表有效作答数", (row) => getNarcissismValidAnswerCount(row)],
  ["新量表NA数量", (row) => getNarcissismNaAnswerCount(row)],
  ["新量表是否低有效作答", (row) => formatNarcissismLowValidity(row, "")],
  ["新量表是否高风险触发", (row) => formatNarcissismHighRiskStatus(row, "")],
  ["新量表高风险触发题", (row) =>
    getNarcissismHighRiskTriggerSummary(row, "")],
  ["新量表主要风险维度", (row) => getNarcissismDimensionSummary(row, "")],
  ["子女分流结果", (row) => formatGateAnswer(row.child_gate_answer)],
  ["跨境分流结果", (row) => formatGateAnswer(row.cross_border_gate_answer)],
  ["当前短板维度", (row) => formatArrayValue(row.weaknesses)],
  ["跟进状态", (row) => getFollowUpStatusLabel(row.follow_up_status)],
  ["服务类型", (row) => formatServiceTypes(row.service_type)],
  ["当前负责人", (row) => row.assigned_to],
  ["约面人员", (row) => row.appointment_owner],
  ["约面时间", (row) => formatDateTime(row.appointment_time)],
  ["最近跟进时间", (row) => formatDateTime(row.last_follow_up_at)],
  ["最近更新时间", (row) => formatDateTime(row.updated_at)],
  ["最近修改人", (row) => row.updated_by],
  ["内部备注", (row) => row.admin_note],
];

function safeCsvCell(value) {
  if (value === null || value === undefined || value === "") return "";
  const text = String(value);
  const protectedText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${protectedText.replaceAll('"', '""')}"`;
}

function buildCsv(rows) {
  const header = CSV_COLUMNS.map(([label]) => safeCsvCell(label)).join(",");
  const body = rows.map((row) =>
    CSV_COLUMNS.map(([, getValue]) => safeCsvCell(getValue(row))).join(",")
  );
  return ["\uFEFF" + header, ...body].join("\r\n");
}

export async function GET(request) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAuthorizedSessionValue(sessionValue)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const filters = normalizeLeadFilters(Object.fromEntries(url.searchParams));
  const { rows, error } = await queryLeadsForExport(filters);

  if (error) {
    return Response.json(
      { error: error.message || "Export failed" },
      { status: 500 }
    );
  }

  const csv = buildCsv(rows);
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `leads-${timestamp}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-Export-Limit": String(LEADS_EXPORT_LIMIT),
      "X-Export-Count": String(rows.length),
    },
  });
}
