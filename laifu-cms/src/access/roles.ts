import type { Access } from "payload";

type RoleUser = { id: string | number; roles?: string[] };

function userWithRoles(user: unknown): RoleUser | null { return user && typeof user === "object" && "id" in user ? user as RoleUser : null; }

export const authenticated: Access = ({ req }) => Boolean(req.user);
export const adminOnly: Access = ({ req }) => Boolean(userWithRoles(req.user)?.roles?.includes("admin"));
export const publisherOrAdmin: Access = ({ req }) => Boolean(userWithRoles(req.user)?.roles?.some(role => role === "admin" || role === "publisher"));
export const adminOrSelf: Access = ({ req }) => { const user = userWithRoles(req.user); if (!user) return false; if (user.roles?.includes("admin")) return true; return { id: { equals: user.id } }; };
export const adminOrOwner: Access = ({ req }) => { const user = userWithRoles(req.user); if (!user) return false; if (user.roles?.includes("admin")) return true; return { owner: { equals: user.id } }; };
export const firstUserOrAdmin: Access = async ({ req }) => { const user = userWithRoles(req.user); if (user?.roles?.includes("admin")) return true; if (user) return false; const result = await req.payload.count({ collection: "users", overrideAccess: true }); return result.totalDocs === 0; };
