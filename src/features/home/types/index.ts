export interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
  rating: number;
  studentsCount: string;
  price: number;
  duration: string;
  badge?: {
    label: string;
    variant: "success" | "accent" | "default";
  };
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  courseCount: string;
  iconName: "code" | "bar-chart" | "palette" | "briefcase" | "megaphone" | "monitor" | "sprout" | "heart";
  colorScheme: "purple" | "blue" | "orange" | "green" | "teal" | "pink";
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
  iconName: "users" | "book-open" | "award" | "star";
}

export interface Company {
  name: string;
}

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface FooterColumn {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}
