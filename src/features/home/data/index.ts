import { HeroFloatingCard } from "../sections/hero/types";
import {
  Course,
  LearningPath,
  Statistic,
  Testimonial,
  NavItem,
  FooterColumn,
} from "../types";

export const navItems: NavItem[] = [
  { label: "Home", href: "/", isActive: true },
  { label: "Courses", href: "/courses" },
  { label: "Instructors", href: "/instructors" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

// Floating Card 2: Top Instructors (Right Side)
export const HeroFloatingCard2Images: HeroFloatingCard[] = [{
  src: "/images/avatars/avatar-1.svg",
  alt: "Instructor",
  width: 28,
  height: 28,
  className: "rounded-full ring-2 ring-card",
}, {
  src: "/images/avatars/avatar-2.svg",
  alt: "Instructor",
  width: 28,
  height: 28,
  className: "rounded-full ring-2 ring-card",
}, {
  src: "/images/avatars/avatar-3.svg",
  alt: "Instructor",
  width: 28,
  height: 28,
  className: "rounded-full ring-2 ring-card",
},

]

// Floating Card 4: 10K+ Active Students (Bottom Right)
export const HeroFloatingCard4Images: HeroFloatingCard[] = [{
  src: "/images/avatars/avatar-4.svg",
  alt: "Instructor",
  width: 24,
  height: 24,
  className: "rounded-full ring-2 ring-card",
}, {
  src: "/images/avatars/avatar-5.svg",
  alt: "Instructor",
  width: 24,
  height: 24,
  className: "rounded-full ring-2 ring-card",
}, {
  src: "/images/avatars/avatar-6.svg",
  alt: "Instructor",
  width: 24,
  height: 24,
  className: "rounded-full ring-2 ring-card",
},

]

export const heroPopularTopics: string[] = [
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Digital Marketing",
];

export const heroBenefits = [
  {
    icon: "award" as const,
    label: "Learn from industry experts",
  },
  {
    icon: "play" as const,
    label: "Learn at your own pace",
  },
  {
    icon: "check-circle" as const,
    label: "Get recognized certificates",
  },
  {
    icon: "users" as const,
    label: "Join a global learning community",
  },
];

export const trustedCompanies = [
  { name: "Google" },
  { name: "Microsoft" },
  { name: "Amazon" },
  { name: "IBM" },
  { name: "Meta" },
  { name: "Spotify" },
  { name: "Adobe" },
  { name: "Tesla" },
  { name: "Samsung" },
];

export const learningPaths: LearningPath[] = [
  {
    id: "dev",
    title: "Development",
    subtitle: "Web, Mobile & More",
    courseCount: "120+ courses",
    iconName: "code",
    colorScheme: "purple",
  },
  {
    id: "data-science",
    title: "Data Science",
    subtitle: "Turn data into insights",
    courseCount: "80+ courses",
    iconName: "bar-chart",
    colorScheme: "blue",
  },
  {
    id: "design",
    title: "Design",
    subtitle: "Create amazing experiences",
    courseCount: "70+ courses",
    iconName: "palette",
    colorScheme: "orange",
  },
  {
    id: "business",
    title: "Business",
    subtitle: "Grow your career",
    courseCount: "60+ courses",
    iconName: "briefcase",
    colorScheme: "green",
  },
  {
    id: "marketing",
    title: "Marketing",
    subtitle: "Reach & engage audiences",
    courseCount: "40+ courses",
    iconName: "megaphone",
    colorScheme: "purple",
  },
  {
    id: "it-software",
    title: "IT & Software",
    subtitle: "Systems, Cloud & Security",
    courseCount: "35+ courses",
    iconName: "monitor",
    colorScheme: "blue",
  },
  {
    id: "personal-dev",
    title: "Personal Development",
    subtitle: "Productivity & Soft Skills",
    courseCount: "50+ courses",
    iconName: "sprout",
    colorScheme: "green",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    subtitle: "Health, Art & Hobbies",
    courseCount: "30+ courses",
    iconName: "heart",
    colorScheme: "pink",
  },
];

export const featuredCourses: Course[] = [
  {
    id: "c-1",
    title: "Complete Web Development Bootcamp",
    slug: "complete-web-development-bootcamp",
    thumbnail: "/images/course-web-dev.jpg",
    instructor: {
      name: "Ahmed Emad",
      avatar: "/images/avatars/avatar-1.svg",
    },
    rating: 4.9,
    studentsCount: "12.4k students",
    price: 49.99,
    duration: "12h 30m",
    badge: {
      label: "Best Seller",
      variant: "success",
    },
  },
  {
    id: "c-2",
    title: "UI/UX Design Masterclass",
    slug: "ui-ux-design-masterclass",
    thumbnail: "/images/course-ui-ux.jpg",
    instructor: {
      name: "Sara Khaled",
      avatar: "/images/avatars/avatar-2.svg",
    },
    rating: 4.8,
    studentsCount: "8.1k students",
    price: 39.99,
    duration: "8h 15m",
    badge: {
      label: "Most Popular",
      variant: "accent",
    },
  },
  {
    id: "c-3",
    title: "Data Science with Python",
    slug: "data-science-with-python",
    thumbnail: "/images/course-data-science.jpg",
    instructor: {
      name: "Omar Ali",
      avatar: "/images/avatars/avatar-3.svg",
    },
    rating: 4.9,
    studentsCount: "10.2k students",
    price: 44.99,
    duration: "10h 45m",
    badge: {
      label: "Highest Rated",
      variant: "success",
    },
  },
  {
    id: "c-4",
    title: "Digital Marketing Essentials",
    slug: "digital-marketing-essentials",
    thumbnail: "/images/course-digital-marketing.jpg",
    instructor: {
      name: "Nada Hossam",
      avatar: "/images/avatars/avatar-4.svg",
    },
    rating: 4.7,
    studentsCount: "7.6k students",
    price: 34.99,
    duration: "6h 20m",
  },
  {
    id: "c-5",
    title: "Productivity & Time Management",
    slug: "productivity-and-time-management",
    thumbnail: "/images/course-productivity.jpg",
    instructor: {
      name: "Mona Tarek",
      avatar: "/images/avatars/avatar-5.svg",
    },
    rating: 4.8,
    studentsCount: "5.3k students",
    price: 29.99,
    duration: "5h 10m",
  },
];

export const statistics: Statistic[] = [
  {
    id: "stat-1",
    value: "10K+",
    label: "Active Students",
    iconName: "users",
  },
  {
    id: "stat-2",
    value: "500+",
    label: "Online Courses",
    iconName: "book-open",
  },
  {
    id: "stat-3",
    value: "100+",
    label: "Expert Instructors",
    iconName: "award",
  },
  {
    id: "stat-4",
    value: "4.8",
    label: "Average Rating",
    iconName: "star",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    quote: "EduWay helped me land my dream job! The courses are practical and easy to follow.",
    name: "Youssef Ibrahim",
    role: "Software Engineer",
    avatar: "/images/avatars/avatar-6.svg",
    rating: 5,
  },
  {
    id: "test-2",
    quote: "Amazing instructors and great community. I learned so much in a short time.",
    name: "Reem Mostafa",
    role: "Product Designer",
    avatar: "/images/avatars/avatar-7.svg",
    rating: 5,
  },
  {
    id: "test-3",
    quote: "The best learning platform I've ever used. Highly recommended!",
    name: "Ali Hassan",
    role: "Digital Marketer",
    avatar: "/images/avatars/avatar-8.svg",
    rating: 5,
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Instructors", href: "/instructors" },
      { label: "Pricing", href: "/pricing" },
      { label: "Students", href: "/students" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
      { label: "Partnerships", href: "/partnerships" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
];
