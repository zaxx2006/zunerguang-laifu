"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@payloadcms/ui";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";

export function AdminThemeToggle(): ReactElement {
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "切换为浅色模式" : "切换为深色模式";
  return <Button aria-label={label} className="acevec-header-control" onClick={() => setTheme(isDark ? "light" : "dark")} size="icon" title={label} variant="ghost">{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</Button>;
}
