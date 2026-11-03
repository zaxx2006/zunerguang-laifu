export const dynamic = "force-dynamic";

export function GET(): Response { return Response.json({ error: { code: "ENDPOINT_RETIRED" } }, { status: 410 }); }
