"use client";

import type { ActionResult } from "@/actions/skills";
import type { SkillCategory } from "@/types";

interface SkillFormProps {
  state: ActionResult;
  formAction: (formData: FormData) => void;
  pending: boolean;
  skill?: {
    id: string;
    name: string;
    category: string;
    description: string | null;
  };
}

const CATEGORIES: SkillCategory[] = [
  "language",
  "framework",
  "backend",
  "database",
  "tools",
];

export function SkillForm({
  state,
  formAction,
  pending,
  skill,
}: SkillFormProps) {
  const errors = state.errors
    ? Object.fromEntries(state.errors.map((e) => [e.field, e.message]))
    : {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {(state.error || (state.errors && state.errors.length > 0)) && (
        <div className="rounded border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
          {state.error || "Please fix the errors below."}
        </div>
      )}

      <Field label="Name" error={errors.name} required>
        <input
          type="text"
          name="name"
          defaultValue={skill?.name}
          required
          className="field"
        />
      </Field>

      <Field label="Category" error={errors.category} required>
        <select
          name="category"
          defaultValue={skill?.category || ""}
          required
          className="field"
        >
          <option value="" disabled>
            Select category...
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          defaultValue={skill?.description || ""}
          rows={3}
          className="field resize-y"
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85 disabled:pointer-events-none disabled:opacity-40"
      >
        {pending ? "Saving..." : skill ? "Save Changes" : "Create Skill"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
