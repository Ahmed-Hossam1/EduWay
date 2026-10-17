import { CategoriesPage } from "@/features/categories/CategoriesPage";
import { getCategoriesWithCounts } from "@/features/categories/server/getCategoriesWithCounts";

export const metadata = {
    title: "Categories",
    description: "Browse EduWay courses by category: web development, data science, design, marketing and more.",
};

type Params = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Categories({ searchParams }: Params) {
    const params = await searchParams;

    // ?q=design => "design" | no q (or ?q=a&q=b) => ""
    const q = typeof params.q === "string" ? params.q : "";

    // No await => the hero shows right away and the cards are streamed
    const categoriesPromise = getCategoriesWithCounts(q);

    return <CategoriesPage categoriesPromise={categoriesPromise} q={q} />;
}
