import { SiteLink } from "@/components/site/SiteLink";
import { photoProps } from "@/lib/photo";
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

export function ServiceCard({ id, href, title, description, image, action }: {
  id?: string; href: string; title: ReactNode; description: string;
  image: { src: string; alt: string; width: number; height: number };
  action: string;
}) {
  return <SiteLink className="branch-card" id={id} href={href} target="_blank" rel="noopener">
    <div className="image-placeholder"><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" {...photoProps(image.src, "(max-width: 680px) 90vw, (max-width: 1100px) 45vw, 20vw")} /></div>
    <h3>{title}</h3><p><span>{description}</span></p>
    <span className="service-arrow">{action}<HomeIcon name="arrow-up-right" /></span>
  </SiteLink>;
}
