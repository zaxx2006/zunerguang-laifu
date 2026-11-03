import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageView } from "@/components/site/PageView";
import { getPage, pageRegistry } from "@/lib/page-registry";
import { metadataForPage } from "@/lib/seo";

type RouteProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return pageRegistry.filter((page) => page.slug).map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const page = getPage(slug.join("/"));
  const metadata = page ? metadataForPage(page) : {};
  if ((await draftMode()).isEnabled) return { ...metadata, robots: { index: false, follow: false } };
  return metadata;
}

export default async function ContentPage({ params }: RouteProps) {
  const { slug } = await params;
  const page = getPage(slug.join("/"));
  if (!page) notFound();
  return <PageView page={page} />;
}
