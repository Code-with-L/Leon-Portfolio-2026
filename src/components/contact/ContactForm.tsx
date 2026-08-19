"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type FormStatus = "idle" | "loading" | "success";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required.";
  }

  return errors;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");

    // Mock submission — no backend yet
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  }

  if (status === "success") {
    return (
      <div className="border border-border p-8 text-center sm:p-10">
        <p className="text-base font-semibold">Message recorded.</p>
        <p className="mt-2 text-sm text-muted">
          The contact form is currently in preview mode. Backend integration
          will be connected in a future phase.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className="rounded border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors duration-150 placeholder:text-muted/50 focus:border-foreground/30"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-red-500" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="rounded border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors duration-150 placeholder:text-muted/50 focus:border-foreground/30"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-500" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What is this about?"
          className="rounded border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors duration-150 placeholder:text-muted/50 focus:border-foreground/30"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
        />
        {errors.subject && (
          <p id="subject-error" className="text-xs text-red-500" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          className="resize-none rounded border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors duration-150 placeholder:text-muted/50 focus:border-foreground/30"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-red-500" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>
        <p className="text-xs text-muted">
          Backend integration is pending. Messages are not currently sent.
        </p>
      </div>
    </form>
  );
}
