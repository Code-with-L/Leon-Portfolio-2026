import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { getCertificates } from "@/repositories/certificates";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Certificates — Leon Muriithi",
  description:
    "Certificates, badges, and learning credentials earned by Leon Muriithi.",
};

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <Container as="main" className="py-20 sm:py-28">
      <SectionHeading
        title="Certificates & Badges"
        description="Credentials and learning milestones from courses, codelabs, and developer programs."
      />
      <div className="mb-8">
        <a
          href={siteConfig.links.googleDeveloper}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
        >
          View Google Developer Profile
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <CertificateGrid certificates={certificates} />
    </Container>
  );
}
