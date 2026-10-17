// One category on the /categories page
export interface CategoryListItem {
    name: string;
    slug: string; // used in the link: /courses?category=web-dev
    coursesCount: number; // published courses only
}
