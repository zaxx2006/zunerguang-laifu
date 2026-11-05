"use client";

import { useEffect, useState } from "react";
import { homeEnvelopeSchema, type HomePresentation } from "@/contracts/cms-home";
import styles from "./SharedInvitation.module.css";

export function SharedInvitation() {
  const [content, setContent] = useState<HomePresentation["invitation"] | null>(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setContent(null);
    setError("");
    fetch("/api/public/v1/laifu/home-presentation", { cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("无法读取已发布的统一页尾，请确认首页已发布后重试。");
      setContent(homeEnvelopeSchema.parse(await response.json()).data.presentation.invitation);
    }).catch(() => { if (!controller.signal.aborted) setError("无法读取已发布的统一页尾，请确认首页已发布后重试。"); });
    return () => controller.abort();
  }, [refresh]);
  return <section className={`field-type ${styles.section}`} aria-labelledby="shared-invitation-title">
    <h3 id="shared-invitation-title">全站统一页尾邀请</h3>
    <p>此处显示首页已发布的统一页尾内容。请在“首页呈现 → 页尾邀请”修改并发布；离婚陪伴辅导页面的标题在本页“页尾邀请”单独设置。</p>
    <p><a href="/admin/collections/home-presentations">前往首页呈现修改页尾</a></p>
    {error ? <p role="alert">{error}</p> : content ? <div><h4>{content.title}</h4>{content.descriptionLines.map((line, index) => <p key={index}>{line}</p>)}<ul>{content.actions.map((action, index) => <li key={index}>{action.label}：{action.href}</li>)}</ul><p>{content.assessmentNote}</p></div> : <p role="status">正在读取已发布的统一页尾…</p>}
    <button type="button" onClick={() => setRefresh(value => value + 1)}>刷新页尾内容</button>
  </section>;
}
