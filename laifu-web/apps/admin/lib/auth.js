export const ADMIN_SESSION_COOKIE = "admin_mvp_session";

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_MVP_USERNAME ?? "",
    password: process.env.ADMIN_MVP_PASSWORD ?? "",
    sessionSecret: process.env.ADMIN_MVP_SESSION_SECRET ?? "",
  };
}

export function isAuthorizedSessionValue(value) {
  const { sessionSecret } = getAdminCredentials();
  return Boolean(sessionSecret) && value === sessionSecret;
}

export function canAuthenticate() {
  const { username, password, sessionSecret } = getAdminCredentials();
  return Boolean(username && password && sessionSecret);
}
