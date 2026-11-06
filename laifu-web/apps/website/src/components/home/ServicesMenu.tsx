"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function ServicesMenu({ label, children }: { label: string; children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  return <details className="services-menu" open={hovered || pinned}
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setHovered(false); }}>
    <summary onClick={event => { event.preventDefault(); setPinned(value => !value); }}>{label}<ChevronDown aria-hidden="true" /></summary>
    {children}
  </details>;
}
