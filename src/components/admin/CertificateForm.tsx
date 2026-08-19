"use client";

import type { ActionResult } from "@/actions/certificates";
import type { MediaImage } from "@/types";
import { ImageField } from "./ImageField";

interface CertificateFormProps {
  state: ActionResult;
  formAction: (formData: FormData) => void;
  pending: boolean;
  certificate?: {
    id: string;
    title: string;
    issuer: string;
    type: string;
    date: string | null;
    skills: string[];
    credentialUrl: string | null;
    image?: MediaImage;
  };
}

export function CertificateForm({
  state,
  formAction,
  pending,
  certificate,
}: CertificateFormProps) {
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
          defaultValue={certificate?.title}
          required
          className="field"
        />
      </Field>

      <Field label="Issuer" error={errors.issuer} required>
        <input
          type="text"
          name="issuer"
          defaultValue={certificate?.issuer}
          required
          className="field"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Type" error={errors.type}>
          <select
            name="type"
            defaultValue={certificate?.type || "certificate"}
            className="field"
          >
            <option value="certificate">Certificate</option>
            <option value="badge">Badge</option>
            <option value="codelab">Codelab</option>
          </select>
        </Field>

        <Field label="Date" error={errors.date}>
          <input
            type="date"
            name="date"
            defaultValue={certificate?.date || ""}
            className="field"
          />
        </Field>
      </div>

      <Field
        label="Skills"
        error={errors.skills}
        hint="Comma-separated"
      >
        <input
          type="text"
          name="skills"
          defaultValue={certificate?.skills?.join(", ")}
          placeholder="React, TypeScript"
          className="field"
        />
      </Field>

      <Field label="Credential URL" error={errors.credentialUrl}>
        <input
          type="url"
          name="credentialUrl"
          defaultValue={certificate?.credentialUrl || ""}
          placeholder="https://..."
          className="field"
        />
      </Field>

      <ImageField
        name="image"
        label="Certificate Image"
        existingImage={certificate?.image}
        folder="certificates"
        entityId={certificate?.id || "new"}
        error={errors.image}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85 disabled:pointer-events-none disabled:opacity-40"
      >
        {pending
          ? "Saving..."
          : certificate
            ? "Save Changes"
            : "Create Certificate"}
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
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
