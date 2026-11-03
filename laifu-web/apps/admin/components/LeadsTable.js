"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getFollowUpStatusLabel,
  getResultLevelLabel,
} from "../lib/constants";
import {
  formatDateTime,
  formatGateAnswer,
  formatScoreRate,
  formatServiceTypes,
} from "../lib/format";
import {
  formatNarcissismAverageScore,
  formatNarcissismHighRiskStatus,
  getAssessmentTypeShortLabel,
  getLeadServiceIntentLabel,
  getNarcissismResultLevelLabel,
  isNarcissismRiskRecord,
} from "../lib/leadAssessment";

function getLeadResultLabel(item) {
  if (isNarcissismRiskRecord(item)) {
    return item.result_label || getNarcissismResultLevelLabel(item.result_level);
  }
  return item.result_label || getResultLevelLabel(item.result_level);
}

function formatLeadScore(item) {
  if (isNarcissismRiskRecord(item)) {
    return formatNarcissismAverageScore(item);
  }
  return formatScoreRate(item.score_rate);
}

function formatLeadGateAnswer(item, key) {
  if (isNarcissismRiskRecord(item)) return "-";
  return formatGateAnswer(item[key]);
}

export default function LeadsTable({ rows, deleteAction }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const selectAllRef = useRef(null);
  const currentPageIds = useMemo(() => rows.map((item) => item.id), [rows]);
  const currentPageKey = useMemo(
    () => currentPageIds.join("|"),
    [currentPageIds]
  );
  const currentPageIdSet = useMemo(
    () => new Set(currentPageIds),
    [currentPageIds]
  );
  const selectedCurrentPageIds = selectedIds.filter((id) =>
    currentPageIdSet.has(id)
  );
  const selectedCount = selectedCurrentPageIds.length;
  const hasRows = rows.length > 0;
  const allCurrentPageSelected = hasRows && selectedCount === rows.length;
  const hasPartialSelection =
    selectedCount > 0 && selectedCount < rows.length;

  useEffect(() => {
    setSelectedIds([]);
  }, [currentPageKey]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = hasPartialSelection;
    }
  }, [hasPartialSelection]);

  function toggleRow(id, checked) {
    setFeedback({ type: "", message: "" });
    setSelectedIds((current) => {
      if (checked) return Array.from(new Set([...current, id]));
      return current.filter((item) => item !== id);
    });
  }

  function toggleCurrentPage(checked) {
    setFeedback({ type: "", message: "" });
    setSelectedIds(checked ? currentPageIds : []);
  }

  async function handleDeleteSelected() {
    if (selectedCount === 0 || isDeleting) return;

    const confirmed = window.confirm(
      `确定要永久删除所选 ${selectedCount} 条记录吗？此操作不可恢复，且不会删除未勾选记录。`
    );
    if (!confirmed) return;

    const idsToDelete = selectedCurrentPageIds;
    setIsDeleting(true);
    try {
      const result = await deleteAction(idsToDelete);

      if (!result?.ok) {
        setFeedback({
          type: "error",
          message: result?.error || "删除失败，请稍后重试。",
        });
        return;
      }

      setSelectedIds([]);
      setFeedback({
        type: "success",
        message: `已删除 ${result.deletedCount ?? idsToDelete.length} 条记录。`,
      });
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  if (!rows.length) {
    return (
      <div className="leads-bulk-shell">
        <p className="empty">当前筛选条件下暂无记录。</p>
      </div>
    );
  }

  return (
    <div className="leads-bulk-shell">
      <div className="bulk-action-bar">
        <span className="muted">已选择 {selectedCount} 条</span>
        {selectedCount > 0 ? (
          <button
            className="btn btn-danger"
            type="button"
            disabled={isDeleting}
            onClick={handleDeleteSelected}
          >
            {isDeleting ? "删除中..." : "删除所选记录"}
          </button>
        ) : null}
      </div>
      {feedback.message ? (
        <div className={`notice ${feedback.type}`}>{feedback.message}</div>
      ) : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="select-col">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  aria-label="全选当前页记录"
                  checked={allCurrentPageSelected}
                  onChange={(event) => toggleCurrentPage(event.target.checked)}
                />
              </th>
              <th>提交时间</th>
              <th>量表</th>
              <th>姓名</th>
              <th>电话</th>
              <th>微信</th>
              <th>结果等级</th>
              <th>得分/平均分</th>
              <th>用户意向</th>
              <th>高风险触发</th>
              <th>子女</th>
              <th>跨境</th>
              <th>跟进状态</th>
              <th>服务类型</th>
              <th>负责人</th>
              <th>最近更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td className="select-col">
                  <input
                    type="checkbox"
                    aria-label={`选择记录 ${item.contact_name || item.id}`}
                    checked={selectedIds.includes(item.id)}
                    onChange={(event) =>
                      toggleRow(item.id, event.target.checked)
                    }
                  />
                </td>
                <td>{formatDateTime(item.created_at)}</td>
                <td>
                  <span className="chip">{getAssessmentTypeShortLabel(item)}</span>
                </td>
                <td>{item.contact_name || "-"}</td>
                <td>{item.contact_phone || "-"}</td>
                <td>{item.contact_wechat || "-"}</td>
                <td>
                  <span className="chip">
                    {getLeadResultLabel(item)}
                  </span>
                </td>
                <td>{formatLeadScore(item)}</td>
                <td>{getLeadServiceIntentLabel(item)}</td>
                <td>{formatNarcissismHighRiskStatus(item)}</td>
                <td>{formatLeadGateAnswer(item, "child_gate_answer")}</td>
                <td>{formatLeadGateAnswer(item, "cross_border_gate_answer")}</td>
                <td>{getFollowUpStatusLabel(item.follow_up_status)}</td>
                <td>{formatServiceTypes(item.service_type)}</td>
                <td>{item.assigned_to || "-"}</td>
                <td>{formatDateTime(item.updated_at || item.created_at)}</td>
                <td>
                  <Link className="btn btn-ghost" href={`/leads/${item.id}`}>
                    查看详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
