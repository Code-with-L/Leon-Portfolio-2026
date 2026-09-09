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
  const isBadge = certificate.type === "badge";
  const isGoogleBadge =
    isBadge && certificate.issuer.toLowerCase().includes("google");
  const credentialLabel = isGoogleBadge ? "Verify on Google" : "View Credential";

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20">
      {certificate.image &&
        (isBadge ? (
          <div className="flex items-center justify-center rounded-xl border border-border/60 bg-foreground/[0.04] p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={certificate.image.url}
              alt={certificate.image.alt}
              className="h-24 w-24 object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={certificate.image.url}
              alt={certificate.image.alt}
              className="h-32 w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="font-medium uppercase tracking-wider">
          {typeLabels[certificate.type]}
        </span>
        {certificate.date && (
          <>
            <span aria-hidden="true">&middot;</span>
            <time>{certificate.date}</time>
          </>
        )}
      </div>

      <div>
        <h3 className="text-base font-semibold tracking-tight text-foreground">
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
        <div className="mt-auto border-t border-border pt-3">
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-150 hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
          >
            {credentialLabel}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )}
    </article>
  );
}
