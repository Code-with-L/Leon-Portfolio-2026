"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createProject, type ActionResult } from "@/actions/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      const result = await createProject(_prev, formData);
      if (result.success) {
        router.push("/admin/projects");
      }
      return result;
    },
    { success: false },
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
      </div>

      <ProjectForm state={state} formAction={formAction} pending={pending} />
    </div>
  );
}
