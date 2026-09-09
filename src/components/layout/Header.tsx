"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        pathname === "/"
          ? "border-white/10 bg-black/60 text-white"
          : "border-border bg-background/80"
      }`}
    >
      <Container>
        <nav
          className="flex h-14 items-center justify-between"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight"
          >
            {siteConfig.name}
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-6 md:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm transition-colors duration-150 ${
                    pathname === "/"
                      ? "hover:text-white"
                      : "hover:text-foreground"
                  } ${
                    isActive(item.href)
                      ? `font-medium ${pathname === "/" ? "text-white" : "text-foreground"}`
                      : pathname === "/"
                        ? "text-white/70"
                        : "text-muted"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded p-2 transition-colors duration-150 hover:text-white md:hidden ${
              pathname === "/" ? "text-white/70" : "text-muted"
            }`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <MobileNav pathname={pathname} onClose={() => setMobileOpen(false)} />
        )}
      </Container>
    </header>
  );
}

function MobileNav({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <ul
      id="mobile-nav"
      className={`flex flex-col gap-1 py-3 md:hidden ${
        pathname === "/" ? "border-t border-white/10" : "border-t border-border"
      }`}
      role="list"
    >
      {siteConfig.nav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`block rounded px-2 py-2 text-sm transition-colors duration-150 ${
              pathname === "/" ? "hover:text-white" : "hover:text-foreground"
            } ${
              isActive(item.href)
                ? `font-medium ${pathname === "/" ? "text-white" : "text-foreground"}`
                : pathname === "/"
                  ? "text-white/70"
                  : "text-muted"
            }`}
            aria-current={isActive(item.href) ? "page" : undefined}
            onClick={onClose}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
