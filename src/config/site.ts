export const siteConfig = {
  name: "Leon Muriithi",
  title: "Leon Muriithi — Software Developer",
  description:
    "Software developer building useful software and learning through real projects.",
  url: "https://leonmuriithi.dev",
  links: {
    github: "https://github.com/Code-with-L",
    email: "hello@leonmuriithi.dev",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Certificates", href: "/certificates" },
    { label: "Skills", href: "/skills" },
    { label: "Contact", href: "/contact" },
  ] as const,
};
