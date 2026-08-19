import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container>
        <div className="flex flex-col gap-8 py-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold">{siteConfig.name}</p>
            <p className="max-w-xs text-xs leading-relaxed text-muted">
              Building practical software and learning through real projects.
            </p>
          </div>

          <div className="flex gap-10">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-1.5" role="list">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted transition-colors duration-150 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="flex flex-col gap-1.5" role="list">
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted transition-colors duration-150 hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-xs text-muted transition-colors duration-150 hover:text-foreground"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-4">
          <p className="text-center text-xs text-muted">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
