import type { ComponentPropsWithRef } from "react";
import { siteLinkAttributes } from "@/lib/site-links";

export function SiteLink(props: ComponentPropsWithRef<"a">) {
  return <a {...props} {...siteLinkAttributes(props)} />;
}
