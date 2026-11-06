"use client";
import { SiteLink } from "@/components/site/SiteLink";

import { useEffect, useState, type FormEvent } from "react";
import { consultationSchema } from "@/contracts/cms-site-page";

export function BookingForm({ phone, wechat, questionnaire }: { phone: string; wechat: string; questionnaire: string }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [consultationType, setConsultationType] = useState("深度咨询");
  useEffect(() => {
    const choose = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-consultation-type]") : null;
      if (link?.dataset.consultationType) setConsultationType(link.dataset.consultationType);
    };
    document.addEventListener("click", choose);
    return () => document.removeEventListener("click", choose);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending" || state === "success") return;
    const values = new FormData(event.currentTarget);
    const result = consultationSchema.safeParse({ ...Object.fromEntries(values), consent: values.get("consent") === "on" });
    if (!result.success) { setState("error"); setMessage(result.error.issues[0].message); return; }
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/consultations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
      if (!response.ok) throw new Error(response.status === 429 ? "提交较为频繁，请稍后重试，或直接电话联系。" : "申请暂时未能保存，请稍后重试，或直接电话联系。");
      setState("success");
      setMessage("预约申请已收到，我们将在24小时内与你取得联系。");
    } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : "提交失败，请稍后重试。"); }
  }
  return <div className="template-booking"><div><p>请填写表单完成预约，我们将在24h内与你取得联系。</p><p>个人信息与咨询内容将依照服务协议和适用法律保护。</p>{questionnaire ? <SiteLink className="coaching-text-link" href={questionnaire} target="_blank" rel="noopener noreferrer">打开预约问卷 ↗</SiteLink> : null}</div><form onSubmit={submit}><fieldset disabled={state === "sending" || state === "success"}><legend className="template-sr-only">预约咨询信息</legend><div className="template-form-grid"><label>姓名／称呼 <span aria-hidden="true">*</span><input name="name" autoComplete="name" maxLength={40} required /></label><label>联系电话 <span aria-hidden="true">*</span><input name="phone" type="tel" autoComplete="tel" maxLength={24} required /></label><label>微信<input name="wechat" autoComplete="off" maxLength={80} /></label><label>咨询类型 <span aria-hidden="true">*</span><select name="consultationType" value={consultationType} onChange={event => setConsultationType(event.target.value)}><option>深度咨询</option><option>轻量咨询</option><option>专项辅导</option><option>合作咨询</option></select></label><label className="template-full">主要困扰 <span aria-hidden="true">*</span><textarea name="concern" rows={5} minLength={5} maxLength={2000} required placeholder="简要说明你目前的处境，以及希望获得的帮助。" /></label><label className="template-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div><label className="template-consent"><input name="consent" type="checkbox" required /><span>我同意焕屿为联系与安排咨询使用本次填写的信息。</span></label><button className="template-submit" type="submit">{state === "sending" ? "正在提交…" : state === "success" ? "申请已收到" : "提交预约申请 →"}</button></fieldset><p className={`template-form-message template-form-message--${state}`} role={state === "error" ? "alert" : "status"} aria-live="polite">{message}</p></form><div className="template-contact"><h3>也可以直接联系我们</h3><p>联系电话：<SiteLink href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</SiteLink></p>{wechat ? <p>微信：{wechat}</p> : null}<p>如遇提交问题，请通过电话说明希望预约的咨询类型。</p></div></div>;
}
