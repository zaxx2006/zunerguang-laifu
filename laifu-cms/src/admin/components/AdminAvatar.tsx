import type { ReactElement } from "react";
import type { ServerProps } from "payload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarRelation = null | number | string | { sizes?: { avatar?: null | { url?: null | string } }; url?: null | string };
type AccountWithAvatar = { avatar?: AvatarRelation; email?: string; name?: null | string };

function resolveAvatarURL(avatar: AvatarRelation | undefined): string | undefined { return avatar && typeof avatar === "object" ? avatar.sizes?.avatar?.url || avatar.url || undefined : undefined; }
function resolveInitials(account: AccountWithAvatar): string { const source = account.name?.trim() || account.email?.trim() || "A"; const words = source.split(/[\s@._-]+/).filter(Boolean); return words.slice(0, 2).map(word => word[0]?.toUpperCase()).join("") || "A"; }

export async function AdminAvatar({ payload, user }: ServerProps): Promise<ReactElement> { const sessionAccount = user as AccountWithAvatar | undefined; const account = user && sessionAccount?.avatar && typeof sessionAccount.avatar !== "object" ? await payload.findByID({ collection: "users", id: user.id, depth: 1, overrideAccess: true, select: { avatar: true, email: true, name: true } }) as AccountWithAvatar : sessionAccount || {}; const source = resolveAvatarURL(account.avatar); const label = account.name?.trim() || account.email?.trim() || "账号头像"; return <Avatar aria-label={label} className="size-[var(--acevec-control-height)]"><AvatarImage alt={label} src={source} /><AvatarFallback>{resolveInitials(account)}</AvatarFallback></Avatar>; }
