"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { updateProject, type ActionResult } from "@/actions/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project } from "@/types";

export default function EditProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/admin/projects/${slug}`);
        if (res.ok) {
          setProject(await res.json());
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      const result = await updateProject(slug, _prev, formData);
      if (result.success) {
        router.push("/admin/projects");
      }
      return result;
    },
    { success: false },
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted">Project not found.</p>
        <Link href="/admin/projects" className="text-sm text-foreground underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit: {project.title}
        </h1>
      </div>

      <ProjectForm
        state={state}
        formAction={formAction}
        pending={pending}
        project={project}
      />
    </div>
  );
}
