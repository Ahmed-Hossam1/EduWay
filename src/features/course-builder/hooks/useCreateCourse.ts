import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCourseService } from "../services/courseBuilder";
import { getEditHref } from "../utils";

/**
 * "Create course" on /teacher/courses/new → the draft is made → go to its edit page.
 *
 *   const { mutate: createCourse, isPending } = useCreateCourse();
 *   createCourse({ title, categoryId });
 */
export const useCreateCourse = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: createCourseService,

        onSuccess: (courseId) => {
            toast.success("Course created — now add its details");
            router.push(getEditHref(courseId));
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't create the course"));
        },
    });
};
