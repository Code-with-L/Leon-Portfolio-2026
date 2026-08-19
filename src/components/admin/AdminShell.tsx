"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase/client";
import { destroySession } from "@/actions/auth";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Skills", href: "/admin/skills" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Always render login page without auth checks
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/admin/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-muted">
            You do not have permission to access the admin area.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-foreground transition-colors hover:text-muted"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    try {
      const auth = getAuthInstance();
      await signOut(auth);
      await destroySession();
      router.push("/admin/login");
    } catch {
      // Silent fail
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border md:block">
        <div className="flex h-full flex-col p-4">
          <Link
            href="/admin"
            className="mb-6 text-sm font-semibold tracking-tight"
          >
            Admin
          </Link>

          <nav aria-label="Admin navigation">
            <ul className="flex flex-col gap-1" role="list">
              {adminNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded px-3 py-2 text-sm transition-colors duration-150 ${
                      isActive(item.href)
                        ? "bg-foreground/[0.06] font-medium text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
            <Link
              href="/"
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              View Portfolio
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-left text-xs text-muted transition-colors hover:text-foreground"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <Link
            href="/admin"
            className="text-sm font-semibold tracking-tight"
          >
            Admin
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            Logout
          </button>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden"
          aria-label="Admin navigation"
        >
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded px-3 py-1.5 text-xs transition-colors duration-150 ${
                isActive(item.href)
                  ? "bg-foreground/[0.06] font-medium text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 md:p-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
