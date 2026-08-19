import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  description,
  className,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10",
        centered && "text-center",
        className,
      )}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
