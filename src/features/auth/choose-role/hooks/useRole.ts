import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { assignRoleService } from "../services/assignRole";

/**
 * Choose student / teacher (once, after signing up):
 *   success → go where the server says (student → home, teacher → onboarding)
 *   error   → toast with the server message (e.g. "Role already assigned")
 *
 *   const { mutate: chooseRole, isPending } = useRole();
 *   chooseRole("teacher");
 */
export const useRole = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: assignRoleService,

        onSuccess: (response) => {
            router.push(response.nextRoute);
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Failed to choose role"));
        },
    });
};
