import manifest from "@/content/photo-manifest.json";
import { getImageProps } from "next/image";

export function photoProps(src: string, sizes: string) {
  const photo = manifest[src as keyof typeof manifest];
  if (photo) return { ...photo, sizes };
  const cmsOrigin = new URL(process.env.LAIFU_CMS_URL || "http://127.0.0.1:5158").origin;
  if (!src.startsWith(`${cmsOrigin}/api/media/file/`)) return {};
  const { props } = getImageProps({ src, alt: "", width: 1280, height: 854, sizes });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
