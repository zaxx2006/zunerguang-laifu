"use client";

import { NavToggler, useNav } from "@payloadcms/ui";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { ReactElement } from "react";

export function AdminNavToggle(): ReactElement {
  const { navOpen } = useNav();
  const Icon = navOpen ? PanelLeftClose : PanelLeftOpen;
  return <NavToggler className="acevec-header-control acevec-header-nav-toggle"><Icon aria-hidden="true" /></NavToggler>;
}
