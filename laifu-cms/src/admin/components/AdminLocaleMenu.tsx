"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type LocaleOption = { code: string; label: string };
type AdminLocaleMenuProps = { currentLocale?: string; locales: LocaleOption[] };

export function AdminLocaleMenu({ currentLocale, locales }: AdminLocaleMenuProps): ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectLocale = (code: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("locale", code);
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button aria-label="切换内容语言" className="acevec-header-control" size="icon" title="切换内容语言" variant="ghost" />}><Languages aria-hidden="true" /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuGroup><DropdownMenuLabel>内容语言</DropdownMenuLabel>{locales.map((locale) => <DropdownMenuItem disabled={locale.code === currentLocale} key={locale.code} onClick={() => selectLocale(locale.code)}>{locale.label}</DropdownMenuItem>)}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
