import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { getCertificates } from "@/data/certificates";

export const metadata: Metadata = {
  title: "Certificates — Leon Muriithi",
  description:
    "Certificates, badges, and learning credentials earned by Leon Muriithi.",
};

export default function CertificatesPage() {
  const certificates = getCertificates();

  return (
    <Container as="main" className="py-20 sm:py-28">
      <SectionHeading
        title="Certificates & Badges"
        description="Credentials and learning milestones from courses, codelabs, and platforms."
      />
      <CertificateGrid certificates={certificates} />
    </Container>
  );
}
