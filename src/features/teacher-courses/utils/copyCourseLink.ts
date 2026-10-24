import { toast } from "sonner";

export const copyCourseLink = async (courseSlug: string) => {
    try {
        await navigator.clipboard.writeText(`${window.location.origin}/courses/${courseSlug}`);
        toast.success("Link copied");
    } catch {
        toast.error("Couldn't copy the link");
    }
};