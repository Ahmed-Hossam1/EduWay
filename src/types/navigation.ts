export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}
