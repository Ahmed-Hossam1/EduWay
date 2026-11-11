import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { updateTeacherProfileService } from "../services/teacherProfile";

/**
 * "Save profile" mutation.
 * On success: shows a toast and refreshes the server page (re-fetches the profile).
 *
 *   const { mutate: saveProfile, isPending } = useUpdateTeacherProfile();
 *   saveProfile(values);
 */
export const useUpdateTeacherProfile = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: updateTeacherProfileService,

        onSuccess: () => {
            toast.success("Profile saved");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the profile"));
        },
    });
};
