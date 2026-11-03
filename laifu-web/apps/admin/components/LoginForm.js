"use client";

import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error || "登录失败，请检查账号密码。");
        return;
      }

      window.location.href = "/leads";
    } catch (requestError) {
      console.error(requestError);
      setError("登录请求失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label className="field">
        <span>内部账号</span>
        <input
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="请输入账号"
          required
        />
      </label>

      <label className="field">
        <span>密码</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="请输入密码"
          required
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "登录中..." : "登录后台"}
      </button>

      {error ? <div className="error">{error}</div> : null}
    </form>
  );
}
