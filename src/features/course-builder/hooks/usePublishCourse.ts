import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { publishCourseService } from "../services/courseBuilder";

/**
 * "Publish course" on the Publish tab.
 * Success → the course is live, the page asks the server again (status badge + checklist).
 * Something missing → the API answers 400 → the toast says it, the refresh shows the checklist.
 *
 *   const { mutate: publish, isPending } = usePublishCourse();
 *   publish(courseId);
 */
export const usePublishCourse = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: publishCourseService,

        onSuccess: () => {
            toast.success("Your course is live!");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't publish the course"));
            router.refresh();
        },
    });
};
