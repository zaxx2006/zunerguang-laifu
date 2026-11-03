import { sitePageResponse } from "@/services/site-page-api";
export const dynamic = "force-dynamic";
export async function GET(request: Request) { return sitePageResponse(request); }
