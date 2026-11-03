import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "../../../../lib/auth";

export async function POST() {
  const response = new NextResponse(null, {
    status: 303,
    headers: {
      Location: "/login",
    },
  });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
  return response;
}
