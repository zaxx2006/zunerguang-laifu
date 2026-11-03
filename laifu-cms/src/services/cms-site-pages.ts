import type { Payload } from "payload";
import { pageContentSchema, sitePageSchema } from "@/contracts/cms-site-page";
import { projectResourceFiles, resourceAttachmentIds } from "./resource-files";

export async function projectSitePage(value: unknown, payload: Payload) {
  const document = value as Record<string, unknown>;
  const source = pageContentSchema.parse(document.content);
  const ids = resourceAttachmentIds(source);
  const files = ids.length ? (await payload.find({ collection: "media", where: { id: { in: ids } }, pagination: false, depth: 0, overrideAccess: true })).docs : [];
  const content = projectResourceFiles(source, files, process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158");
  const image = document.image as { url?: string; alt?: string; width?: number; height?: number } | null;
  const booking = document.booking as { phone?: string; wechat?: string; questionnaire?: string } | undefined;
  return sitePageSchema.parse({ route: document.route, anchorPrefix: document.anchorPrefix, title: document.title, description: document.description, content, image: image ? { src: new URL(image.url ?? "", process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://127.0.0.1:5158").toString(), alt: image.alt, width: image.width, height: image.height } : document.originalImage, booking: document.route === "/book-consultation/" ? { phone: booking?.phone, wechat: booking?.wechat ?? "", questionnaire: booking?.questionnaire ?? "" } : undefined });
}
