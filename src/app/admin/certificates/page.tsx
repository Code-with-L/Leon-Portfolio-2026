"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { deleteCertificate } from "@/actions/certificates";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  type: string;
  date: string | null;
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    async function fetchCertificates() {
      try {
        const res = await fetch("/api/admin/certificates");
        if (res.ok) {
          setCertificates(await res.json());
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted">Loading certificates...</p>
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this certificate? This cannot be undone.")) return;
    const result = await deleteCertificate(id);
    if (result.success) {
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(result.error || "Failed to delete certificate.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
        <Link
          href="/admin/certificates/new"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85"
        >
          + New
        </Link>
      </div>

      {certificates.length === 0 ? (
        <p className="text-sm text-muted">No certificates yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between gap-4 rounded border border-border p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {cert.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {cert.issuer} · {cert.type}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/admin/certificates/${cert.id}/edit`)
                  }
                  className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cert.id)}
                  className="rounded border border-border px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
