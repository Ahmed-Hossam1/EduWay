// A row of the categories table — THE category type of the app
// (course cards, course details, onboarding, course builder... all use this one)
export interface CategoryRow {
    id: string;
    name: string;
    slug: string;
}

// One category on the /categories page
export interface CategoryListItem {
    name: string;
    slug: string; // used in the link: /courses?category=web-dev
    coursesCount: number; // published courses only
}
