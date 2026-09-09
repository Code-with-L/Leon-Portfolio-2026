import type { Certificate } from "@/types";
import { CertificateCard } from "./CertificateCard";

interface CertificateGridProps {
  certificates: Certificate[];
}

export function CertificateGrid({ certificates }: CertificateGridProps) {
  if (certificates.length === 0) {
    return (
      <div className="border border-border p-12 text-center sm:p-16">
        <p className="text-sm leading-relaxed text-muted">
          I&apos;m actively building my technical foundation through hands-on
          labs, courses, and developer programs.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Certificates and badges will appear here as they are completed.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} />
      ))}
    </div>
  );
}
