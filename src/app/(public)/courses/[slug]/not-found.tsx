import { Metadata } from "next";
import { BookX } from "lucide-react";
import { NotFoundView } from "@/components/shared/NotFoundView";

export const metadata: Metadata = {
    title: "Course not found",
};

// course specific notFound Page
// /courses/[slug] called notFound() (wrong slug, or the course is not published)
export default function CourseNotFound() {
    return (
        <NotFoundView
            icon={BookX}
            title="Course not found"
            description="This course doesn't exist or isn't available anymore. Find another one to start learning."
            actions={[
                { label: "Browse courses", href: "/courses" },
                { label: "Explore categories", href: "/categories" },
            ]}
        />
    );
}
