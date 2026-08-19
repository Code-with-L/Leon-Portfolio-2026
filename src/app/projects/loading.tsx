import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container as="main" className="py-20 sm:py-28">
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-border" />
        <div className="h-4 w-72 animate-pulse rounded bg-border" />
      </div>
      <div className="mt-12 grid gap-px sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <div className="h-3 w-24 animate-pulse rounded bg-border" />
              <div className="h-5 w-48 animate-pulse rounded bg-border" />
              <div className="h-4 w-full animate-pulse rounded bg-border" />
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded bg-border" />
                <div className="h-5 w-20 animate-pulse rounded bg-border" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
