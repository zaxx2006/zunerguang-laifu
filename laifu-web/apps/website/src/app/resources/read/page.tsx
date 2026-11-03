import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderLoader } from "@/components/reader/ReaderLoader";
import { getReaderResource } from "@/lib/reader-resources";

type Props = { searchParams: Promise<{ resource?: string; mode?: string }> };
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "资源阅读器", robots: { index: false, follow: false } };

export default async function ResourceReaderPage({ searchParams }: Props) {
  const { resource: id, mode } = await searchParams;
  if (!id) notFound();
  const resource = await getReaderResource(id);
  if (!resource) notFound();
  return <ReaderLoader resource={resource} embedded={mode === "flip"} />;
}
