"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-5">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-muted">
          Error
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
