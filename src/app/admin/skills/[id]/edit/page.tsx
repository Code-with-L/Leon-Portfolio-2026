"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { updateSkill, type ActionResult } from "@/actions/skills";
import { SkillForm } from "@/components/admin/SkillForm";

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | null;
}

export default function EditSkillPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkill() {
      try {
        const res = await fetch(`/api/admin/skills/${id}`);
        if (res.ok) {
          setSkill(await res.json());
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchSkill();
  }, [id]);

  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      const result = await updateSkill(id, _prev, formData);
      if (result.success) {
        router.push("/admin/skills");
      }
      return result;
    },
    { success: false },
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted">Loading skill...</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted">Skill not found.</p>
        <Link
          href="/admin/skills"
          className="text-sm text-foreground underline"
        >
          Back to skills
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/skills"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit: {skill.name}
        </h1>
      </div>

      <SkillForm
        state={state}
        formAction={formAction}
        pending={pending}
        skill={skill}
      />
    </div>
  );
}
