import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <Container as="main" className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-24">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Leon Muriithi
        </h1>
        <p className="text-lg text-muted">Software Developer</p>
        <p className="text-base leading-relaxed text-muted">
          Building useful software and learning through real projects.
        </p>
        <div className="flex gap-3">
          <Link href="/projects">
            <Button>View Projects</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary">Contact</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
