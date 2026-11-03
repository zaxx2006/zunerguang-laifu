import { Bell, Search } from "lucide-react";
import Link from "next/link";
import type { ServerProps } from "payload";
import type { ReactElement } from "react";
import { buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { AdminLocaleMenu } from "./AdminLocaleMenu";
import { AdminNavToggle } from "./AdminNavToggle";
import { AdminThemeToggle } from "./AdminThemeToggle";

export function AdminHeaderActions({ locale, payload, user }: ServerProps): ReactElement {
  const localization = payload.config.localization;
  const locales = localization ? localization.locales.map(({ code, label }) => ({ code, label: typeof label === "string" ? label : code })) : [];
  const adminUser = user as { email?: string; name?: string; roles?: string[] } | null;
  const displayName = adminUser?.name || adminUser?.email || "后台用户";
  const roleLabel = adminUser?.roles?.includes("admin") ? "系统管理员" : "内容编辑";
  return (
    <div className="acevec-header-actions">
      <AdminNavToggle />
      <form action="/admin/collections/page-presentations" className="acevec-global-search" method="get" role="search"><InputGroup className="h-full"><InputGroupInput aria-label="全局搜索" autoComplete="off" className="h-full" name="search" placeholder="搜索页面内容…" /><InputGroupAddon><Search aria-hidden="true" /></InputGroupAddon></InputGroup></form>
      <Link aria-label="发布事件" className={cn(buttonVariants({ size: "icon", variant: "ghost" }), "acevec-header-control")} href="/admin/collections/publish-events" title="发布事件"><Bell aria-hidden="true" /></Link>
      <AdminThemeToggle />
      <AdminLocaleMenu currentLocale={locale?.code} locales={locales} />
      <span className="acevec-admin-identity"><strong>{displayName}</strong><small>{roleLabel}</small></span>
    </div>
  );
}
