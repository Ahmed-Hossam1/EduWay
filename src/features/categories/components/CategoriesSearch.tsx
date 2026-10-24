import { UrlSearchInput } from "@/components/shared/UrlSearchInput";

// Search the categories by name, while the user types (the debounce + URL logic is in UrlSearchInput)
export function CategoriesSearch() {
    return (
        <div className="mt-7 max-w-xl">
            <UrlSearchInput placeholder="Search categories" Size="lg" />
        </div>
    );
}
