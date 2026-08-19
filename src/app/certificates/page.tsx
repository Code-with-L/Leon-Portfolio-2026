import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { getCertificates } from "@/repositories/certificates";

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
      <CertificateGrid certificates={certificates} />
    </Container>
  );
}
