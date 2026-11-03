import type { ReactNode } from "react";
import "./preview.css";

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body>{children}</body></html>;
}
