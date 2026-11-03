import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import { ADMIN_SESSION_COOKIE, isAuthorizedSessionValue } from "../../lib/auth";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (isAuthorizedSessionValue(sessionValue)) {
    redirect("/leads");
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <h1>后台登录</h1>
        <p>仅限内部授权人员访问。</p>
        <LoginForm />
      </section>
    </main>
  );
}
