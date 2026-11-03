"use client";

export default function ReaderError({ reset }: { reset: () => void }) {
  return <main id="main-content" className="shell"><h1>暂时无法打开资源</h1><p>资源中心连接失败，请稍后重试。</p><button type="button" onClick={reset}>重新加载</button><a href="/resources/">返回资源中心</a></main>;
}
