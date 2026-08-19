import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex gap-4">
            <li>
              <Link
                href={siteConfig.links.github}
                className="text-xs text-muted transition-colors hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href={`mailto:${siteConfig.links.email}`}
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                Email
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
