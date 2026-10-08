import { HeroFloatingCard } from "../sections/hero/types";
import {
  LearningPath,
  Statistic,
  Testimonial,
} from "../types";

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


