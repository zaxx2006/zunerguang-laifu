import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  canAuthenticate,
  getAdminCredentials,
} from "../../../../lib/auth";

export async function POST(request) {
  if (!canAuthenticate()) {
    return NextResponse.json(
      { error: "后台鉴权环境变量未配置完整。" },
      { status: 500 }
    );
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误。" }, { status: 400 });
  }

  const username = (payload.username ?? "").trim();
  const password = payload.password ?? "";
  const expected = getAdminCredentials();

  if (username !== expected.username || password !== expected.password) {
    return NextResponse.json({ error: "账号或密码错误。" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: expected.sessionSecret,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
