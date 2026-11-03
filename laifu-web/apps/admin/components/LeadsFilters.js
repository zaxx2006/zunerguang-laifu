"use client";

import { useMemo, useState } from "react";
import {
  FOLLOW_UP_STATUS_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "../lib/constants";
import {
  ASSESSMENT_TYPE_FILTER_OPTIONS,
  SERVICE_INTENT_FILTER_OPTIONS,
  getResultLevelFilterOptions,
  normalizeResultLevelFilterValue,
} from "../lib/leadAssessment";

function buildOptions(options) {
  return options.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ));
}

export default function LeadsFilters({ filters }) {
  const [assessmentType, setAssessmentType] = useState(filters.assessmentType);
  const [resultLevel, setResultLevel] = useState(filters.resultLevel);
  const resultLevelOptions = useMemo(
    () => getResultLevelFilterOptions(assessmentType),
    [assessmentType]
  );

  function handleAssessmentTypeChange(event) {
    const nextAssessmentType = event.target.value;
    setAssessmentType(nextAssessmentType);
    setResultLevel((currentResultLevel) =>
      normalizeResultLevelFilterValue(currentResultLevel, nextAssessmentType)
    );
  }

  return (
    <form method="get" className="panel">
      <div className="grid">
        <label className="field">
          <span>姓名关键词</span>
          <input
            name="name"
            defaultValue={filters.name}
            placeholder="支持模糊匹配"
          />
        </label>

        <label className="field">
          <span>电话关键词</span>
          <input
            name="phone"
            defaultValue={filters.phone}
            placeholder="支持模糊匹配"
          />
        </label>

        <label className="field">
          <span>提交开始时间</span>
          <input
            name="createdFrom"
            type="datetime-local"
            defaultValue={filters.createdFrom}
          />
        </label>

        <label className="field">
          <span>提交结束时间</span>
          <input
            name="createdTo"
            type="datetime-local"
            defaultValue={filters.createdTo}
          />
        </label>

        <label className="field">
          <span>量表类型</span>
          <select
            name="assessmentType"
            value={assessmentType}
            onChange={handleAssessmentTypeChange}
          >
            {buildOptions(ASSESSMENT_TYPE_FILTER_OPTIONS)}
          </select>
        </label>

        <label className="field">
          <span>用户意向</span>
          <select name="serviceIntent" defaultValue={filters.serviceIntent}>
            {buildOptions(SERVICE_INTENT_FILTER_OPTIONS)}
          </select>
        </label>

        <label className="field">
          <span>跟进状态</span>
          <select name="followUpStatus" defaultValue={filters.followUpStatus}>
            {buildOptions(FOLLOW_UP_STATUS_OPTIONS)}
          </select>
        </label>

        <label className="field">
          <span>结果等级</span>
          <select
            name="resultLevel"
            value={resultLevel}
            onChange={(event) => setResultLevel(event.target.value)}
          >
            {buildOptions(resultLevelOptions)}
          </select>
        </label>

        <label className="field">
          <span>当前负责人</span>
          <input
            name="assignedTo"
            defaultValue={filters.assignedTo}
            placeholder="输入姓名筛选"
          />
        </label>

        <label className="field">
          <span>服务类型</span>
          <select name="serviceType" defaultValue={filters.serviceType}>
            {buildOptions(SERVICE_TYPE_OPTIONS)}
          </select>
        </label>
      </div>

      <div className="toolbar" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" type="submit">
          查询
        </button>
        <a className="btn btn-muted" href="/leads">
          重置
        </a>
      </div>
    </form>
  );
}
