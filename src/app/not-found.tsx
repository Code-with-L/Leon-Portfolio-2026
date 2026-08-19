import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container as="main" className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-muted">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </Container>
  );
}
