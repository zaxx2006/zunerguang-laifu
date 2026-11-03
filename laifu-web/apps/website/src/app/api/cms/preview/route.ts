import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getPage } from "@/lib/page-registry";

function validSecret(value: string): boolean {
  const expected = process.env.LAIFU_PREVIEW_SECRET || "";
  return expected.length >= 32 && value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");
  const id = url.searchParams.get("id");
  const serviceKey = url.searchParams.get("key");
  const pageRoute = url.searchParams.get("route") || "";
  if (!validSecret(url.searchParams.get("secret") || "") || !id || (collection !== "home-presentations" && collection !== "service-presentations" && collection !== "site-pages" && collection !== "navigation")) return new NextResponse("Preview request is invalid", { status: 401 });
  if (collection === "site-pages" && (!/^\/(?!\/)[\w/-]+\/$/.test(pageRoute) || !getPage(pageRoute.slice(1, -1)))) return new NextResponse("Preview request is invalid", { status: 401 });
  if (collection === "service-presentations" && !(["divorce-coaching", "high-conflict-divorce"]).includes(serviceKey || "")) return new NextResponse("Preview request is invalid", { status: 401 });
  const kind = collection === "home-presentations" ? "home" : collection === "service-presentations" ? "service" : collection === "site-pages" ? "page" : "navigation";
  const redirectPath = kind === "service" ? `/services/${serviceKey}/` : kind === "page" ? pageRoute : "/";
  const draft = await draftMode();
  draft.enable();
  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  response.cookies.set(kind === "service" ? `laifu_preview_service_${serviceKey}_id` : `laifu_preview_${kind}_id`, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 3600 });
  if (kind === "page") response.cookies.set("laifu_preview_page_route", pageRoute, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 3600 });
  return response;
}
