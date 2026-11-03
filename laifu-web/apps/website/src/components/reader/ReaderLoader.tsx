"use client";

import dynamic from "next/dynamic";
import type { ReaderResource } from "@/contracts/resource-reader";

const DocumentReader = dynamic(() => import("./DocumentReader").then(module => module.DocumentReader), { ssr: false, loading: () => <main id="main-content" role="status">正在打开阅读器…</main> });

export function ReaderLoader(props: { resource: ReaderResource; embedded: boolean }) {
  return <DocumentReader {...props} />;
}
