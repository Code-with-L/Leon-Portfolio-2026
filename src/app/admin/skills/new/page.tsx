"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createSkill, type ActionResult } from "@/actions/skills";
import { SkillForm } from "@/components/admin/SkillForm";

export default function NewSkillPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      const result = await createSkill(_prev, formData);
      if (result.success) {
        router.push("/admin/skills");
      }
      return result;
    },
    { success: false },
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/skills"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Skill</h1>
      </div>

      <SkillForm state={state} formAction={formAction} pending={pending} />
    </div>
  );
}
