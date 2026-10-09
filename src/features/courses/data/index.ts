import { BookOpen, GraduationCap, Star, Users } from "lucide-react";
import { FilterGroup, HeroStat, PopularTopic, SortOption } from "../types";

// Static UI data — replace with real data from the API later

// Static filters (the "Category" filter comes from the database → getCategories)
export const coursesFilterGroups: FilterGroup[] = [
  {
    id: "level",
    title: "Level",
    options: [
      { id: "beginner", label: "Beginner" },
      { id: "intermediate", label: "Intermediate" },
      { id: "advanced", label: "Advanced" },
    ],
  },
  {
    id: "price",
    title: "Price",
    options: [
      { id: "free", label: "Free" },
      { id: "paid", label: "Paid" },
    ],
  },
  {
    id: "duration",
    title: "Duration",
    options: [
      { id: "0-3", label: "0 – 3 hours" },
      { id: "3-10", label: "3 – 10 hours" },
      { id: "10-plus", label: "10+ hours" },
    ],
  },
];

export const coursesSortOptions: SortOption[] = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const coursesRatingOptions: number[] = [4.5, 4, 3.5];


// Courses hero: numbers on the right side
export const coursesHeroStats: HeroStat[] = [
  { id: "courses", value: "300+", label: "Online courses", icon: BookOpen, color: "text-primary bg-primary/10" },
  { id: "instructors", value: "120+", label: "Expert instructors", icon: GraduationCap, color: "text-sky-600 bg-sky-500/10 dark:text-sky-400" },
  { id: "learners", value: "17K+", label: "Active learners", icon: Users, color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" },
  { id: "rating", value: "4.8", label: "Average rating", icon: Star, color: "text-amber-500 bg-amber-500/10" },
];

// Courses hero: quick links under the search (slug = category id in the URL)
export const coursesPopularTopics: PopularTopic[] = [
  { label: "Web Development", slug: "web-dev" },
  { label: "Data Science", slug: "data-ai" },
  { label: "UI/UX Design", slug: "design" },
  { label: "Marketing", slug: "marketing" },
];
