"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { deleteSkill } from "@/actions/skills";

interface Skill {
  name: string;
  category: string;
  description: string | null;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<(Skill & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    async function fetchSkills() {
      try {
        const res = await fetch("/api/admin/skills");
        if (res.ok) {
          setSkills(await res.json());
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted">Loading skills...</p>
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill? This cannot be undone.")) return;
    const result = await deleteSkill(id);
    if (result.success) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(result.error || "Failed to delete skill.");
    }
  }

  const grouped = skills.reduce(
    (acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, (Skill & { id: string })[]>,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85"
        >
          + New
        </Link>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-muted">No skills yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold capitalize text-foreground">
                {category}
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between gap-4 rounded border border-border px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {skill.name}
                      </p>
                      {skill.description && (
                        <p className="mt-0.5 text-xs text-muted truncate">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/admin/skills/${skill.id}/edit`)
                        }
                        className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(skill.id)}
                        className="rounded border border-border px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
