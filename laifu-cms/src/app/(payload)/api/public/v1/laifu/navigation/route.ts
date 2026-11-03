import { cmsResponse } from "@/services/public-cms-api";
export const dynamic = "force-dynamic";
export async function GET(request: Request) { return cmsResponse("navigation", request); }
