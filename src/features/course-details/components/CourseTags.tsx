import { Badge } from "@/components/ui/badge";
import { CourseTag } from "../types";

type CourseTagsProps = {
    tags: CourseTag[];
};

// "Skills you'll gain" — course_tags
export function CourseTags({ tags }: CourseTagsProps) {
    if (tags.length === 0) return null;

    return (
        <section aria-labelledby="tags-title">
            <h2 id="tags-title" className="text-2xl font-bold tracking-tight text-foreground">
                Skills you&apos;ll gain
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="h-auto px-3 py-1 text-sm">
                        {tag.name}
                    </Badge>
                ))}
            </div>
        </section>
    );
}
