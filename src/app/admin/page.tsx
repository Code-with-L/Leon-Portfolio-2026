"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Counts {
  projects: number;
  certificates: number;
  skills: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch("/api/admin/counts");
        if (res.ok) {
          setCounts(await res.json());
        }
      } catch {
        // counts will stay null
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your portfolio content.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/projects"
          className="flex flex-col gap-2 rounded border border-border p-5 transition-colors hover:border-foreground/20"
        >
          <span className="text-2xl font-semibold text-foreground">
            {counts ? counts.projects : "—"}
          </span>
          <span className="text-sm text-muted">Projects</span>
        </Link>
        <Link
          href="/admin/certificates"
          className="flex flex-col gap-2 rounded border border-border p-5 transition-colors hover:border-foreground/20"
        >
          <span className="text-2xl font-semibold text-foreground">
            {counts ? counts.certificates : "—"}
          </span>
          <span className="text-sm text-muted">Certificates</span>
        </Link>
        <Link
          href="/admin/skills"
          className="flex flex-col gap-2 rounded border border-border p-5 transition-colors hover:border-foreground/20"
        >
          <span className="text-2xl font-semibold text-foreground">
            {counts ? counts.skills : "—"}
          </span>
          <span className="text-sm text-muted">Skills</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className="rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85"
          >
            + New Project
          </Link>
          <Link
            href="/admin/certificates/new"
            className="rounded border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
          >
            + New Certificate
          </Link>
          <Link
            href="/admin/skills/new"
            className="rounded border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
          >
            + New Skill
          </Link>
        </div>
      </div>
    </div>
  );
}
