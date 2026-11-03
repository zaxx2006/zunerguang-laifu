import type { JSX } from "react";

function BrandName(): JSX.Element {
  return <span className="acevec-brand__name"><strong>内容管理平台</strong><small>CONTENT MANAGEMENT PLATFORM</small></span>;
}

export function Logo(): JSX.Element {
  return <span className="acevec-brand" aria-label="AceVec 内容管理平台"><img className="acevec-brand__mark acevec-brand__mark--light" src="/brand/mark-ink.svg" alt="" height="56" width="56" /><img className="acevec-brand__mark acevec-brand__mark--dark" src="/brand/mark-paper.svg" alt="" height="56" width="56" /><BrandName /></span>;
}

export function Icon(): JSX.Element {
  return <span className="acevec-header-brand" aria-label="AceVec"><img className="acevec-brand__mark--light" src="/brand/mark-ink.svg" alt="" height="28" width="28" /><img className="acevec-brand__mark--dark" src="/brand/mark-paper.svg" alt="" height="28" width="28" /></span>;
}
