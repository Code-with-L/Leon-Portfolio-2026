"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { updateCertificate, type ActionResult } from "@/actions/certificates";
import { CertificateForm } from "@/components/admin/CertificateForm";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  type: string;
  date: string | null;
  skills: string[];
  credentialUrl: string | null;
}

export default function EditCertificatePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const res = await fetch(`/api/admin/certificates/${id}`);
        if (res.ok) {
          setCertificate(await res.json());
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchCertificate();
  }, [id]);

  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      const result = await updateCertificate(id, _prev, formData);
      if (result.success) {
        router.push("/admin/certificates");
      }
      return result;
    },
    { success: false },
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted">Loading certificate...</p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted">Certificate not found.</p>
        <Link
          href="/admin/certificates"
          className="text-sm text-foreground underline"
        >
          Back to certificates
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/certificates"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit: {certificate.title}
        </h1>
      </div>

      <CertificateForm
        state={state}
        formAction={formAction}
        pending={pending}
        certificate={certificate}
      />
    </div>
  );
}
