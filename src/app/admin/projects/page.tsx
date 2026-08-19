"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { deleteProject } from "@/actions/projects";
import type { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    async function fetchProjects() {
      try {
        const res = await fetch("/api/admin/projects");
        if (res.ok) {
          setProjects(await res.json());
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted">Loading projects...</p>
      </div>
    );
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const result = await deleteProject(slug);
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      alert(result.error || "Failed to delete project.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85"
        >
          + New
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted">No projects yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="flex items-center justify-between gap-4 rounded border border-border p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {project.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {project.category} · {project.status}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/admin/projects/${project.slug}/edit`)
                  }
                  className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.slug)}
                  className="rounded border border-border px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
