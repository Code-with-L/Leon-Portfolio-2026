"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createCertificate, type ActionResult } from "@/actions/certificates";
import { CertificateForm } from "@/components/admin/CertificateForm";

export default function NewCertificatePage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      const result = await createCertificate(_prev, formData);
      if (result.success) {
        router.push("/admin/certificates");
      }
      return result;
    },
    { success: false },
  );

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
          New Certificate
        </h1>
      </div>

      <CertificateForm
        state={state}
        formAction={formAction}
        pending={pending}
      />
    </div>
  );
}
