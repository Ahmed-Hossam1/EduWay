import { FilterGroup, SortOption } from "../types";

// Static UI data — replace with real data from the API later

export const coursesFilterGroups: FilterGroup[] = [
  {
    id: "category",
    title: "Category",
    options: [
      { id: "web-dev", label: "Web Development", count: 128 },
      { id: "data-ai", label: "Data Science & AI", count: 86 },
      { id: "design", label: "Design & Creative", count: 64 },
      { id: "marketing", label: "Digital Marketing", count: 42 },
      { id: "business", label: "Business & Productivity", count: 37 },
    ],
  },
  {
    id: "level",
    title: "Level",
    options: [
      { id: "beginner", label: "Beginner", count: 152 },
      { id: "intermediate", label: "Intermediate", count: 118 },
      { id: "advanced", label: "Advanced", count: 57 },
    ],
  },
  {
    id: "price",
    title: "Price",
    options: [
      { id: "free", label: "Free", count: 24 },
      { id: "paid", label: "Paid", count: 303 },
    ],
  },
  {
    id: "duration",
    title: "Duration",
    options: [
      { id: "0-3", label: "0 – 3 hours", count: 61 },
      { id: "3-10", label: "3 – 10 hours", count: 140 },
      { id: "10-plus", label: "10+ hours", count: 126 },
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

export const coursesCategoryChips: string[] = [
  "All",
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Marketing",
  "Productivity",
];
