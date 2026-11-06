import { SiteLink } from "@/components/site/SiteLink";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import "./home-design-tokens.css";
import "./home.css";

export function HomeDesignSystem({ children }: { children: ReactNode }) {
  return <div className="home-preview">{children}</div>;
}

export function HomeIcon({ name, className }: { name: "arrow-up-right" | "arrow-down" | "search"; className?: string }) {
  return <img src={`/home-preview/${name}.svg`} alt="" aria-hidden="true" className={className} />;
}

type HomeButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "hero" | "navigation" | "invitation" | "primary" | "text";
};

const buttonClasses = { hero: "hero-cta", navigation: "nav-cta", invitation: "invitation-button", primary: "primary", text: "text-link" };

export function HomeButton({ variant = "hero", children, className, ...props }: HomeButtonProps) {
  return <SiteLink className={[buttonClasses[variant], className].filter(Boolean).join(" ")} {...props}>
    {variant === "invitation" ? <span className="btn-label">{children}</span> : children}
    {variant === "hero" || variant === "navigation" || variant === "primary" ? <HomeIcon name="arrow-up-right" /> : null}
  </SiteLink>;
}
