"use client";

import { ready, subscribe, unsubscribe } from "@payloadcms/live-preview";
import { startTransition, useEffect, useState } from "react";
import { HomePreview } from "./HomePreview";
import { NavigationPreview } from "./NavigationPreview";
import { PagePreview } from "./PagePreview";

type PreviewState = "loading" | "saved" | "live" | "unavailable";
type PreviewDocument = Record<string, unknown>;

const stateLabels: Record<PreviewState, string> = { loading: "正在载入草稿", saved: "已载入草稿", live: "实时同步中", unavailable: "等待编辑器数据" };

function PreviewView({ collection, document }: { collection: string; document: PreviewDocument }) { if (collection === "navigation") return <NavigationPreview document={document} />; if (collection === "page-presentations") return <PagePreview document={document} />; return <HomePreview document={document} />; }
function hasPreviewFields(document: PreviewDocument): boolean { return Object.keys(document).some(key => key !== "id"); }

export function PreviewShell({ collection }: { collection: string }) {
  const [document, setDocument] = useState<PreviewDocument>({});
  const [state, setState] = useState<PreviewState>("loading");
  useEffect(() => {
    const serverURL = window.location.origin;
    const id = new URLSearchParams(window.location.search).get("id");
    const initialData: PreviewDocument = id ? { id } : {};
    const controller = new AbortController();
    let active = true;
    let hasLiveData = false;
    const onMessage = subscribe<PreviewDocument>({ serverURL, initialData, depth: 1, callback: data => { if (!active || !hasPreviewFields(data)) return; hasLiveData = true; startTransition(() => { setDocument(data); setState("live"); }); } });
    ready({ serverURL });
    async function loadSavedDraft() {
      if (id) {
        try {
          const response = await fetch(`/api/${collection}/${encodeURIComponent(id)}?draft=true&depth=1`, { credentials: "include", signal: controller.signal });
          if (!response.ok) throw new Error(String(response.status));
          const savedDocument = await response.json() as PreviewDocument;
          Object.assign(initialData, savedDocument);
          if (active && !hasLiveData) { setDocument(savedDocument); setState("saved"); }
        } catch {
          if (active && !hasLiveData) setState("unavailable");
        }
      } else if (active) setState("unavailable");
    }
    void loadSavedDraft();
    return () => { active = false; controller.abort(); unsubscribe(onMessage); };
  }, [collection]);
  return <div className="preview-shell"><div className={`preview-shell__status is-${state}`}><span /><strong>{stateLabels[state]}</strong><small>ACEVEC PREVIEW</small></div><PreviewView collection={collection} document={document} /></div>;
}
