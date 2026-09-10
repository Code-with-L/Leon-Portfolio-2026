import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <Container>
        <div className="flex flex-col gap-8 py-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-white">{siteConfig.name}</p>
            <p className="max-w-xs text-xs leading-relaxed text-white/60">
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
                      className="text-xs text-white/60 transition-colors duration-150 hover:text-white"
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
                  className="text-xs text-white/60 transition-colors duration-150 hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-xs text-white/60 transition-colors duration-150 hover:text-white"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-4">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-center text-xs text-white/60">
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </p>
            <p className="text-center text-[10px] text-white/40">
              3D model by{" "}
              <a
                href="https://sketchfab.com/3d-models/huracan-eagletm-ea7b91e22b8848ac8d02c79b1c574fc1"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 transition-colors hover:text-white/60"
              >
                SDC PERFORMANCE
              </a>{" "}
              on Sketchfab (CC Attribution-NonCommercial)
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
