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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 text-white backdrop-blur-xl supports-[backdrop-filter]:bg-black/30">
      {/* Subtle violet bottom glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/20 to-transparent"
      />
      <Container>
        <nav className="flex h-[64px] items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#a855f7] to-[#7c3aed] text-sm font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(168,85,247,0.5)] group-hover:scale-[1.02]">
              L
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              {siteConfig.name}
            </span>
            <span className="block text-sm font-semibold tracking-tight sm:hidden">
              Leon
            </span>
          </Link>

          {/* Desktop — pill nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-[44px] items-center justify-center rounded-full px-4 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-[#a855f7]/15 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)] ring-1 ring-[#a855f7]/20"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span
                        className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]"
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile toggle — violet accent when open */}
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-white/70 transition-all duration-200 hover:text-white md:hidden ${
              mobileOpen
                ? "border-[#a855f7]/30 bg-[#a855f7]/15 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-4 w-4">
              <span
                className={`absolute left-0 top-[3px] block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-0.5 w-4 rounded-full bg-current transition-all duration-200 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[11px] block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>

        {/* Mobile menu — glass, large type, violet accents */}
        {mobileOpen && <MobileNav pathname={pathname} onClose={() => setMobileOpen(false)} />}
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
    <div
      id="mobile-nav"
      className="border-t border-white/10 bg-black/60 py-6 backdrop-blur-xl md:hidden"
      role="dialog"
      aria-label="Mobile navigation"
    >
      <ul className="flex flex-col gap-1" role="list">
        {siteConfig.nav.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-[44px] items-center justify-between rounded-xl px-4 py-3 text-base transition-all duration-200 ${
                  active
                    ? "bg-[#a855f7]/15 text-white ring-1 ring-[#a855f7]/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" aria-hidden="true" />
                  )}
                  {item.label}
                </span>
                <span
                  className={`text-sm transition-transform duration-200 ${
                    active ? "translate-x-0 text-white" : "translate-x-0 text-white/30 group-hover:translate-x-0.5 group-hover:text-white/60"
                  }`}
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
      <p className="mt-4 text-center text-xs tracking-wider text-white/30">LEON MURIITHI — 2026</p>
    </div>
  );
}
