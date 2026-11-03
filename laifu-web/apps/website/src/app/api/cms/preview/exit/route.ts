import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  (await draftMode()).disable();
  const store = await cookies();
  store.delete("laifu_preview_home_id");
  store.delete("laifu_preview_service_id");
  store.delete("laifu_preview_service_divorce-coaching_id");
  store.delete("laifu_preview_service_high-conflict-divorce_id");
  store.delete("laifu_preview_navigation_id");
  store.delete("laifu_preview_page_id");
  store.delete("laifu_preview_page_route");
  return NextResponse.redirect(new URL("/", request.url), 303);
}
