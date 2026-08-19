export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  links: {
    github: string;
    email: string;
  };
  nav: readonly NavItem[];
}
