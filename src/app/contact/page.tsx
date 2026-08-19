import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Leon Muriithi",
  description:
    "Get in touch with Leon Muriithi for questions, ideas, or collaboration.",
};

export default function ContactPage() {
  return (
    <Container as="main" className="py-20 sm:py-28">
      <div className="mx-auto max-w-xl">
        <SectionHeading
          title="Contact"
          description="Have a question, idea, or want to collaborate? I'd like to hear from you."
          centered
        />
        <ContactForm />
      </div>
    </Container>
  );
}
