import { notFound } from "next/navigation";
import { PreviewShell } from "@/preview/components/PreviewShell";

const supportedCollections = new Set(["home-presentations", "page-presentations", "navigation"]);

export default async function PreviewPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!supportedCollections.has(collection)) notFound();
  return <PreviewShell collection={collection} />;
}
