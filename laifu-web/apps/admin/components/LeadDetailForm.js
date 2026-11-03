"use client";

import { useMemo, useState } from "react";
import {
  ASSET_TIER_LEVEL_OPTIONS,
  FOLLOW_UP_STATUS_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  getServiceTypeLabel,
} from "../lib/constants";
import { formatDateTime, formatDateTimeInputValue } from "../lib/format";
import { getIncludedDimensionCodes } from "../lib/reportContent";

function buildOptions(options) {
  return options
    .filter((item) => item.value !== "all")
    .map((item) => (
      <option key={item.value} value={item.value}>
        {item.label}
      </option>
    ));
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

function normalizeServiceTypes(values) {
  const selected = Array.from(new Set(values.filter(Boolean)));
  if (!selected.length || selected.includes("none")) return ["none"];
  return selected.sort();
}

const SELECTABLE_SERVICE_TYPE_VALUES = new Set(
  SERVICE_TYPE_OPTIONS.filter((item) => item.value !== "all").map(
    (item) => item.value
  )
);

function isSelectableServiceType(value) {
  return SELECTABLE_SERVICE_TYPE_VALUES.has(value);
}

function getPreservedServiceTypes(values) {
  return normalizeServiceTypes(values).filter(
    (value) => value !== "none" && !isSelectableServiceType(value)
  );
}

function getInitialServiceTypes(value) {
  if (Array.isArray(value) && value.length) return value;
  if (value) return [value];
  return ["none"];
}

const CONTACT_SUPPLEMENT_STATUS = new Set([
  "contacted",
  "consulting",
  "converted",
]);

function hasContactSupplementValue(value) {
  return (
    value.client_age !== "" ||
    Boolean(value.client_gender) ||
    Boolean(value.client_location) ||
    Boolean(value.asset_tier_level) ||
    Boolean(value.marital_dispute_summary)
  );
}

function makeBaseline(row, serviceTypes) {
  return {
    follow_up_status: row.follow_up_status || "new",
    service_type: normalizeServiceTypes(serviceTypes),
    assigned_to: row.assigned_to || "",
    appointment_owner: row.appointment_owner || "",
    appointment_time: formatDateTimeInputValue(row.appointment_time),
    client_age: row.client_age ?? "",
    client_gender: row.client_gender || "",
    client_location: row.client_location || "",
    asset_tier_level: row.asset_tier_level || "",
    marital_dispute_summary: row.marital_dispute_summary || "",
    admin_note: row.admin_note || "",
    report_version: row.report_version || "",
  };
}

function getServiceLabels(values) {
  const normalized = normalizeServiceTypes(values);
  if (normalized.includes("none")) return getServiceTypeLabel("none");

  const labels = normalized
    .map((value) => getServiceTypeLabel(value))
    .filter(Boolean);
  return labels.length ? labels.join("、") : getServiceTypeLabel("none");
}

function ReadonlyBox({ label, value }) {
  return (
    <div className="readonly-box">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export default function LeadDetailForm({
  row,
  action,
  canOpenLegacyReport = true,
  canOpenReport = canOpenLegacyReport,
  reportIncludedDimensionText = "",
  reportUnavailableMessage = "",
}) {
  const initialServiceTypes = useMemo(
    () => getInitialServiceTypes(row.service_type),
    [row.service_type]
  );
  const baseline = useMemo(
    () => makeBaseline(row, initialServiceTypes),
    [row, initialServiceTypes]
  );
  const [formState, setFormState] = useState(baseline);
  const [serviceTypes, setServiceTypes] = useState(initialServiceTypes);

  const currentState = {
    ...formState,
    service_type: normalizeServiceTypes(serviceTypes),
  };
  const isDirty = JSON.stringify(currentState) !== JSON.stringify(baseline);
  const shouldShowContactSupplement =
    hasContactSupplementValue(formState) ||
    CONTACT_SUPPLEMENT_STATUS.has(formState.follow_up_status);
  const reportStatus = canOpenReport
    ? row.report_generated_at
      ? "可预览"
      : "未生成"
    : "暂未接入";
  const includedDimensionCodes = canOpenLegacyReport
    ? getIncludedDimensionCodes({
        childGateAnswer: row.child_gate_answer,
        crossBorderGateAnswer: row.cross_border_gate_answer,
      })
    : [];
  const includedDimensionValue =
    reportIncludedDimensionText || includedDimensionCodes.join("、") || "-";

  function updateField(name, value) {
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function toggleServiceType(value, checked) {
    setServiceTypes((current) => {
      if (value === "none") {
        return checked ? ["none"] : [];
      }

      const selectableValues = current.filter(
        (item) => item !== "none" && isSelectableServiceType(item)
      );
      if (checked) return Array.from(new Set([...selectableValues, value]));

      const nextSelectableValues = selectableValues.filter(
        (item) => item !== value
      );
      if (nextSelectableValues.length) return nextSelectableValues;
      return getPreservedServiceTypes(current);
    });
  }

  const preservedServiceTypes = getPreservedServiceTypes(serviceTypes);

  return (
    <form action={action} className="detail-form">
      <Section title="后台跟进信息" description="本区为本轮核心可编辑字段。">
        <div className="grid detail-edit-grid">
          <label className="field">
            <span>跟进状态</span>
            <select
              name="follow_up_status"
              value={formState.follow_up_status}
              onChange={(event) =>
                updateField("follow_up_status", event.target.value)
              }
            >
              {buildOptions(FOLLOW_UP_STATUS_OPTIONS)}
            </select>
          </label>

          <div className="field service-type-field">
            <span>服务类型（可多选）</span>
            <div className="service-type-editor">
              <div className="service-type-selected">
                当前已选：
                <strong>{getServiceLabels(serviceTypes)}</strong>
              </div>
              <div className="checkbox-grid">
                {preservedServiceTypes.map((value) => (
                  <input
                    key={value}
                    type="hidden"
                    name="service_type"
                    value={value}
                  />
                ))}
                {SERVICE_TYPE_OPTIONS.filter((item) => item.value !== "all").map(
                  (item) => (
                    <label className="checkbox-field" key={item.value}>
                      <input
                        type="checkbox"
                        name="service_type"
                        value={item.value}
                        checked={serviceTypes.includes(item.value)}
                        onChange={(event) =>
                          toggleServiceType(item.value, event.target.checked)
                        }
                      />
                      <span>{item.label}</span>
                    </label>
                  )
                )}
              </div>
              <p className="muted field-help">
                可多选；若选择“未明确”或不选择任何有效项，保存后按 none 处理。
              </p>
            </div>
          </div>

          <label className="field">
            <span>当前负责人</span>
            <input
              name="assigned_to"
              value={formState.assigned_to}
              onChange={(event) => updateField("assigned_to", event.target.value)}
              placeholder="填写内部称呼或姓名"
            />
          </label>

          <label className="field">
            <span>约面 / 沟通对接人</span>
            <input
              name="appointment_owner"
              value={formState.appointment_owner}
              onChange={(event) =>
                updateField("appointment_owner", event.target.value)
              }
              placeholder="可与负责人不同"
            />
          </label>

          <label className="field">
            <span>约面 / 沟通时间</span>
            <input
              type="datetime-local"
              name="appointment_time"
              value={formState.appointment_time}
              onChange={(event) =>
                updateField("appointment_time", event.target.value)
              }
            />
          </label>

          <ReadonlyBox label="最近跟进时间" value={formatDateTime(row.last_follow_up_at)} />
          <ReadonlyBox label="最近修改人" value={row.updated_by || "-"} />
          <ReadonlyBox label="最近更新时间" value={formatDateTime(row.updated_at)} />
        </div>

        {shouldShowContactSupplement ? (
          <div className="sub-panel contact-supplement">
            <div className="section-head compact">
              <h3>建联补充信息</h3>
              <p>仅记录建联后的最小画像信息与核心争议摘要。</p>
            </div>
            <div className="grid detail-edit-grid">
              <label className="field">
                <span>客户年龄</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="client_age"
                  value={formState.client_age}
                  onChange={(event) =>
                    updateField("client_age", event.target.value)
                  }
                  placeholder="非负整数"
                />
              </label>

              <label className="field">
                <span>客户性别</span>
                <select
                  name="client_gender"
                  value={formState.client_gender}
                  onChange={(event) =>
                    updateField("client_gender", event.target.value)
                  }
                >
                  <option value="">未填写</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </label>

              <label className="field">
                <span>主要所在地</span>
                <input
                  name="client_location"
                  value={formState.client_location}
                  onChange={(event) =>
                    updateField("client_location", event.target.value)
                  }
                  placeholder="城市 / 地区"
                />
              </label>

              <label className="field">
                <span>资产阶层等级</span>
                <select
                  name="asset_tier_level"
                  value={formState.asset_tier_level}
                  onChange={(event) =>
                    updateField("asset_tier_level", event.target.value)
                  }
                >
                  <option value="">未填写</option>
                  {ASSET_TIER_LEVEL_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field full-span">
                <span>核心婚姻争议摘要</span>
                <textarea
                  name="marital_dispute_summary"
                  value={formState.marital_dispute_summary}
                  onChange={(event) =>
                    updateField(
                      "marital_dispute_summary",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="只记录当前案件核心争议本身，不替代内部备注。"
                />
              </label>
            </div>
          </div>
        ) : null}
      </Section>

      <Section title="内部备注" description="第一版先用单字段承载当前判断与下一步安排。">
        <label className="field">
          <span>内部备注</span>
          <textarea
            name="admin_note"
            value={formState.admin_note}
            onChange={(event) => updateField("admin_note", event.target.value)}
            rows={8}
            placeholder="[日期 处理人] 已做动作；用户当前情况；关键判断；下一步。"
          />
        </label>
      </Section>

      <Section
        title={
          canOpenReport
            ? "用户测评详细解读报告区"
            : "详细报告暂未接入"
        }
        description={
          canOpenReport
            ? "本区仅展示状态与主入口，不在详情页内直接展开长报告正文。"
            : "该记录不会进入旧离婚力量表详细报告。"
        }
      >
        <div className="grid detail-edit-grid">
          <label className="field">
            <span>报告版本</span>
            <input
              name="report_version"
              value={formState.report_version}
              onChange={(event) =>
                updateField("report_version", event.target.value)
              }
              placeholder="例如 v1 或 internal_rule_v1"
            />
          </label>

          <ReadonlyBox label="报告状态" value={reportStatus} />
          <ReadonlyBox
            label="报告生成时间"
            value={formatDateTime(row.report_generated_at)}
          />
          <ReadonlyBox
            label="纳入报告维度"
            value={includedDimensionValue}
          />
        </div>

        <div className="report-entry-actions">
          <div className="muted reserve-note">
            {canOpenReport
              ? "当前首版采用独立子页面预览，进入报告页时会轻量写回报告生成时间与默认版本，不联动其他跟进字段。"
              : reportUnavailableMessage}
          </div>
          {canOpenReport ? (
            <a className="btn btn-primary" href={`/leads/${row.id}/report`}>
              查看用户测评详细解读报告
            </a>
          ) : (
            <span className="btn btn-muted disabled-btn" aria-disabled="true">
              暂不生成详细报告
            </span>
          )}
        </div>

        <p className="muted reserve-note">
          {canOpenReport
            ? "当前展示口径仅保留“未生成 / 可预览”。图片导出在报告页中完成，PDF 导出与 report_content 持久化后置。"
            : "后台跟进字段仍可正常保存；详细报告、图片导出和 PDF 导出待第二阶段接入。"}
        </p>
      </Section>

      <section className="panel save-bar">
        <div>
          <div className="muted">
            保存后会同步刷新最近跟进时间、最近更新时间，并记录当前后台登录账号。
          </div>
          <div className="save-hint">本次编辑只有点击“保存当前编辑”后才会写入后台。</div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={!isDirty}>
          保存当前编辑
        </button>
      </section>
    </form>
  );
}
