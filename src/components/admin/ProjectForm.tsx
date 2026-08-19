"use client";

import type { ActionResult } from "@/actions/projects";
import type { Project } from "@/types";

interface ProjectFormProps {
  state: ActionResult;
  formAction: (formData: FormData) => void;
  pending: boolean;
  project?: Project;
}

export function ProjectForm({
  state,
  formAction,
  pending,
  project,
}: ProjectFormProps) {
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

      <Field label="Title" error={errors.title} required>
        <input
          type="text"
          name="title"
          defaultValue={project?.title}
          required
          className="field"
        />
      </Field>

      <Field label="Slug" error={errors.slug} required>
        <input
          type="text"
          name="slug"
          defaultValue={project?.slug}
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          placeholder="my-project"
          className="field"
        />
      </Field>

      <Field label="Short Description" error={errors.shortDescription} required>
        <input
          type="text"
          name="shortDescription"
          defaultValue={project?.shortDescription}
          required
          className="field"
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          defaultValue={project?.description}
          rows={4}
          className="field resize-y"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" error={errors.category} required>
          <input
            type="text"
            name="category"
            defaultValue={project?.category}
            required
            className="field"
          />
        </Field>

        <Field label="Status" error={errors.status}>
          <select
            name="status"
            defaultValue={project?.status || "completed"}
            className="field"
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
        </Field>
      </div>

      <Field label="Year" error={errors.year}>
        <input
          type="number"
          name="year"
          defaultValue={project?.year}
          min={2000}
          max={2100}
          className="field"
        />
      </Field>

      <Field
        label="Technologies"
        error={errors.technologies}
        hint="Comma-separated"
      >
        <input
          type="text"
          name="technologies"
          defaultValue={project?.technologies?.join(", ")}
          placeholder="React, TypeScript, Tailwind"
          className="field"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="GitHub URL" error={errors.githubUrl}>
          <input
            type="url"
            name="githubUrl"
            defaultValue={project?.githubUrl}
            placeholder="https://github.com/..."
            className="field"
          />
        </Field>

        <Field label="Live URL" error={errors.liveUrl}>
          <input
            type="url"
            name="liveUrl"
            defaultValue={project?.liveUrl}
            placeholder="https://..."
            className="field"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured}
          className="h-4 w-4 accent-accent"
        />
        Featured project
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85 disabled:pointer-events-none disabled:opacity-40"
      >
        {pending
          ? "Saving..."
          : project
            ? "Save Changes"
            : "Create Project"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
