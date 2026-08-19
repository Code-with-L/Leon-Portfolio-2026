import type { Certificate } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface CertificateCardProps {
  certificate: Certificate;
}

const typeLabels: Record<Certificate["type"], string> = {
  certificate: "Certificate",
  badge: "Badge",
  codelab: "Codelab",
};

export function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border p-6 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {typeLabels[certificate.type]}
        </span>
        {certificate.date && (
          <time className="text-xs text-muted">{certificate.date}</time>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          {certificate.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{certificate.issuer}</p>
      </div>
      {certificate.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {certificate.skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      )}
      {certificate.credentialUrl && (
        <div className="mt-auto pt-2">
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-muted"
          >
            View Credential &rarr;
          </a>
        </div>
      )}
    </article>
  );
}
