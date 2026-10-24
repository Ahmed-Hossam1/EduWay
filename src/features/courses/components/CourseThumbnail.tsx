import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type CourseThumbnailProps = {
    src: string | null; // course.thumbnail_url (null = the course has no image yet)
    alt: string;
    sizes: string; // how wide the image is on screen (Next.js picks the right file size)
    priority?: boolean; // true for the big image at the top of a page
    zoomOnHover?: boolean; // the card zoom effect (needs a "group" class on the card)
    iconClassName?: string; // size of the fallback icon, e.g. "size-8"
};

/**
 * The image of a course, or a gray box with an icon when it has none.
 * It fills its parent → the parent sets the size and the shape:
 *
 *   <div className="relative aspect-16/10 w-24 overflow-hidden rounded-lg bg-muted">
 *       <CourseThumbnail src={course.thumbnail_url} alt={course.title} sizes="96px" />
 *   </div>
 */
export function CourseThumbnail({
    src,
    alt,
    sizes,
    priority = false,
    zoomOnHover = false,
    iconClassName = "size-6",
}: CourseThumbnailProps) {
    if (!src) {
        return (
            <span className="flex size-full items-center justify-center text-muted-foreground">
                <ImageOff className={iconClassName} />
            </span>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn(
                "object-cover",
                zoomOnHover && "transition-transform duration-300 group-hover:scale-105",
            )}
        />
    );
}
